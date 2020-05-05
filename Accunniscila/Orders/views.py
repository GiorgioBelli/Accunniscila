from django.shortcuts import render


from Orders.models import Order, OrderStatus
from Users.models import UserInformation
from Menu.models import Pizza, Slice, PizzaIngredients , Ingredient

from Utilities.views import EmptyAPIView, AuthAPIView, JsonMessage
import json
import datetime 

from django.http import HttpResponse

from django.core.serializers.json import DjangoJSONEncoder

# Create your views here.

class RetrieveOrders(AuthAPIView):
    '''
        Restituisce in json tutti gli ordini effettuati
    '''
    
    def post(self,request):
        if(not self.authenticated(request)): return JsonMessage(status=400,result_msg="login required")

        user = request.user
        user_info = UserInformation.objects.get(user__username = user)
        
        return self.getStaffOrders() if user.is_staff else self.getClientOrders(user_info)

    def getClientOrders(self,user_info):
        orders = Order.objects.filter(client=user_info)

        data = []

        for order in orders:
            data.append(Order.serialize(order))
        
        return JsonMessage(body=data)


    def getStaffOrders(self,filters={}):

        orders = Order.objects.all()
        
        data = []

        for order in orders:
            data.append(Order.serialize(order))
        
        return JsonMessage(body=data)

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
                        "totalSlices" : number,
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
        
        if(not self.authenticated(request)): return JsonMessage(status=400,result_msg="login required")

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
            pizza.totalSlices = pizz.get("totalSlices")
            pizza.save()
            
            for ingredient in pizz.get("ingredients"):

                if not Ingredient.exists(ingredient[0]):
                    return JsonMessage(status=400,result_msg="Uno degli ingredienti non è registrato nel sistema !")
                if not Slice.exists(ingredient[1]):
                    return JsonMessage(status=400,result_msg="Numero di slice non supportato !")

                ing = Ingredient.objects.get(name = ingredient[0])
                sli = Slice.objects.get(number = ingredient[1])

                ing_sli, created = PizzaIngredients.objects.get_or_create(ingredient = ing, pslice = sli)
                if created : ing_sli.save()
                pizza.pizzaIngredients.add(ing_sli)
            
            order.pizza.add(pizza) 
    
        order.save()
        return JsonMessage(status=200,result_msg="Congratulazioni, il tuo ordine è stato registrato con successo.")
        
class RetrieveOrderDetails(AuthAPIView):
    '''
    Restituisce in dettaglio i parametri di un determinato ordine
    '''
    def post(self, request, order):
        if(not self.authenticated(request)): return JsonMessage(status=400,result_msg="login required")

        body = json.loads(request.body)
        
        user = request.user
        user_info = UserInformation.objects.get(user__username = user)

        return self.getStaffOrders(order) if user.is_staff else self.getClientOrders(user_info, order)


    def getClientOrders(self, user_info, order_id):
        try:
            order = Order.objects.get(id = order_id, client = user_info)
        except Order.DoesNotExist:
            return JsonMessage(status=400,result_msg="L'ordine richiesto non è presente nel sistema o non appartiene all'utente!")
        
        return JsonMessage(body=Order.serialize(order))


    def getStaffOrders(self, order_id, filters={}):
        try:
            order = Order.objects.get(id = order_id)
        except Order.DoesNotExist:
            return JsonMessage(status=400, result_msg="L'ordine richiesto non è presente nel sistema !")
    
        return JsonMessage(body=Order.serialize(order)) 

class UpdateOrder(AuthAPIView):
    '''
    Aggiorna lo stato di un ordine
    json expected   {
                        "status" : "P" or "W", "C"
                    }
    '''
    def post(self, request, order):
        if(not self.authenticated(request)): return JsonMessage(status=400,result_msg="login required")

        body = json.loads(request.body)

        try:
            order = Order.objects.get(id = order)
        except Order.DoesNotExist:
            return JsonMessage(status=400,result_msg="L'ordine che si sta tentando di aggiornare non è presente nel sistema!")
        
        newState = OrderStatus.is_valid(body.get("status"))
        if newState != None :
            order.status = newState
        else :
            return JsonMessage(status=400,result_msg="Lo stato non è supportato dal sistema!")

        order.save()
        
        return JsonMessage(status=200,result_msg="L'ordine è stato aggiornato correttamente")