from django.shortcuts import render
from django.contrib.auth.models import User


from Orders.models import Order, OrderStatus
from Menu.models import Pizza, Ingredient, Slice, PizzaIngredients

from Utilities.views import EmptyAPIView, AuthAPIView, JsonMessage
import json
import datetime 

from django.http import HttpResponse
from django.http import JsonResponse

from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.

class RetrieveOrders(AuthAPIView):
    '''
        Restituisce in json tutti gli ordini effettuati

        Expected json { 
                "status" : enum(pending,working,closed),
            }
    '''
    
    def post(self,request):
        # try: self.authenticate(request)
        # except Exception: return

        body = json.loads(request.body)
        status = body.get("status",None)
        ret_all = False

        if(status == None): ret_all = True
        elif(not OrderStatus.is_valid(status)):
            return JsonResponse(
                JsonMessage(
                    status=400, 
                    message="invalid order status, use one among {}".format(OrderStatus.as_list().join(", "))
                ).parse(),
                safe=False
            )
        
        if(ret_all): orders = Order.objects.all()
        else: orders = Order.objects.filter(status=status)

        data = []

        for order in orders:
            data.append(Order.serialize(order))
        
        return JsonResponse(
                JsonMessage(body=data).parse(),
                safe=False
        )

class CreateOrder(AuthAPIView):
    '''
        Inserisce nel sistema un nuovo ordine

        Expected json { 
                "user" : userID,
                "withdrawal" : date,
                "pizza" : [
                    {
                        "name" : pizzaName,
                        "totalSlice" : number,
                        "ingredients" :[
                            (ingredient_name, slice_number),
                            .... ,
                            (ingredient_name, slice_number)
                        ]
                    },
                    .... ,
                    {
                        "name" : pizzaName,
                        "totalSlice" : number,
                        "ingredients" :[
                            (ingredient_name, slice_number),
                            .... ,
                            (ingredient_name, slice_number)
                        ]
                    }
                ]
            }

    '''        
    
    def post(self,request):

        #try: self.authenticate(request)
        #except Exception: return JsonResponse("L'Utente non ha effettuato correttamente il LogIn !", safe=False) 

        body = json.loads(request.body)

        #if not User.exists(body.get["user"]):
            #return JsonResponse("L'Utente non esiste !", safe=False) 

        user = User.objects.get(id = body.get("user"))

        order = Order()
        order.date = datetime.datetime.now()
        order.client = user
        order.withdrawal = datetime.datetime.strptime(body.get("withdrawal"), '%m/%d/%y %H:%M:%S')
        order.save()
        
        for pizz in body.get("pizza"):
            
            pizza = Pizza()
            pizza.name = pizz.get("name")
            pizza.totalSlice = pizz.get("totalSlice")
            pizza.save()
            
            for ingredient in pizz.get("ingredients"):

                if not Ingredient.exists(ingredient[0]):
                    return JsonResponse("Uno degli ingredienti non è registrato nel sistema !", safe=False) 
                if not Slice.exists(ingredient[1]):
                    return JsonResponse("Numero di slice non supportato !", safe=False) 

                ing = Ingredient.objects.get(name = ingredient[0])
                sli = Slice.objects.get(number = ingredient[1])

                ing_sli, created = PizzaIngredients.objects.get_or_create(ingredient = ing, pslice = sli)
                if created : ing_sli.save()
                pizza.pizzaIngredients.add(ing_sli)
            
            order.pizza.add(pizza) 
    
        
        order.save()
        return JsonResponse("Ordine Inserito con successo", safe=False)