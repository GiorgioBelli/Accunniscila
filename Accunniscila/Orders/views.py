from django.shortcuts import render


from Orders.models import Order, OrderStatus
from Users.models import UserInformation
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
                            [ingredient_name, slice_number],
                            .... ,
                            [ingredient_name, slice_number]
                        ]
                    },
                    .... ,
                    {
                        "name" : pizzaName,
                        "totalSlice" : number,
                        "ingredients" :[
                            [ingredient_name, slice_number],
                            .... ,
                            [ingredient_name, slice_number]
                        ]
                    }
                ]
            }

    '''        
    
    def post(self,request):

        #try: self.authenticate(request)
        #except Exception: return JsonResponse(JsonMessage(status=400,message="L'Utente non ha effettuato correttamente il LogIn !").parse(), safe=False) 

        body = json.loads(request.body)

        user = UserInformation.objects.get(user__username = request.user)
        
        order = Order()
        order.date = datetime.datetime.now()
        order.client = user
        order.withdrawal = datetime.datetime.strptime(body.get("withdrawal"), '%d-%m-%Y %H:%M')
        order.address = body.get("address")
        order.save()
        
        for pizz in body.get("pizza"):
            
            pizza = Pizza()
            pizza.name = pizz.get("name")
            pizza.totalSlice = pizz.get("totalSlice")
            pizza.save()
            
            for ingredient in pizz.get("ingredients"):

                if not Ingredient.exists(ingredient[0]):
                    return JsonResponse(JsonMessage(status=400,message="Uno degli ingredienti non è registrato nel sistema !").parse(), safe=False) 
                if not Slice.exists(ingredient[1]):
                    return JsonResponse(JsonMessage(status=400,message="Numero di slice non supportato !").parse(), safe=False) 

                ing = Ingredient.objects.get(name = ingredient[0])
                sli = Slice.objects.get(number = ingredient[1])

                ing_sli, created = PizzaIngredients.objects.get_or_create(ingredient = ing, pslice = sli)
                if created : ing_sli.save()
                pizza.pizzaIngredients.add(ing_sli)
            
            order.pizza.add(pizza) 
    
        order.save()
        return JsonResponse(JsonMessage(status=200,message="Ordine Inserito con successo").parse(), safe=False)