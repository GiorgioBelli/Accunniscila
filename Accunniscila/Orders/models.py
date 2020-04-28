from django.db import models
from django.contrib.auth.models import User
from Menu.models import Pizza
from Users.models import UserInformation

import datetime 

# Enumerators


class OrderStatus():
    
    PENDING='P'
    WORKING='W'
    COMPLETED='C' 

    @staticmethod
    def as_enum():
        return ((OrderStatus.PENDING, 'pending'),
                (OrderStatus.WORKING, 'working'),
                (OrderStatus.COMPLETED, 'completed'))

    @staticmethod
    def as_list():
        return [OrderStatus.PENDING, OrderStatus.WORKING, OrderStatus.COMPLETED]

    @staticmethod
    def is_valid(value):
        return value in OrderStatus.as_list()



# Create your models here.
'''
    Modella gli ordini effetuati dagli utenti registrati
'''
class Order(models.Model):
    date = models.DateField(auto_now=True)
    status = models.CharField(max_length=2,choices=OrderStatus.as_enum(),default=OrderStatus.PENDING)
    client = models.ForeignKey(UserInformation,on_delete=models.CASCADE)
    pizza = models.ManyToManyField(Pizza)
    withdrawal = models.DateTimeField()

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(order):
        serialization = {
            "id" : order.id,
            "date" : order.date,
            "status" : order.status,
            "withdrawal" : order.withdrawal,
        }


        serialization["client"] = UserInformation.serialize(order.client)

        serialization["pizzas"] = []
        for pizza in order.pizza.all():
            serialization["pizzas"].append(Pizza.serialize(pizza))
        
        return serialization
                
                
    @staticmethod
    def exists(client,date):
        try:
            order = Order.objects.get(client=client,date=date)
        except Order.DoesNotExist:
            return False
        return True
