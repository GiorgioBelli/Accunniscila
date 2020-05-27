from django.shortcuts import render

from Utilities.views import EmptyAPIView, AuthAPIView, JsonMessage
from .models import Menu, Pizza, Ingredient

from django.http import HttpResponse

import random

import json

# Create your views here.

class RetrieveIngredients(AuthAPIView):
    def post(self,request):
        ingredients = Ingredient.objects.all()
        
        data=[]
        for ingredient in ingredients:
            data.append(Ingredient.serialize(ingredient))

        return JsonMessage(body=data)

class RetrieveMenu(EmptyAPIView):

    def post(self,request):

        body = json.loads(request.body)

        name = body.get("name")

        try: Menu.exists(name)
        except Exception:
            return JsonMessage(
                status="404",
                result_msg="Un'able to find menu {}".format(name)
                )


        menu_pizzas = Menu.objects.get(name=name)

        data = []
        for pizza in menu_pizzas.pizzas:
            data.append(Pizza.serialize(pizza))

        return JsonMessage(body=data)

class RetrieveAvailableMenus(EmptyAPIView):
    def post(self,request):
        menus = Menu.objects.all()

        data = []
        for menu in menus:
            data.append(Menu.serialize(menu))

        return JsonMessage(body=data)

class RetrieveFavouritePizzas(EmptyAPIView):
    def post(self,request):

        body = json.loads(request.body)

        number = body.get("number")

        menus = Menu.objects.prefetch_related("pizzas").all()

        print(menus)

        pizzas = []
        for menu in menus:
            for pizza in menu.pizzas.all():
                pizzas.append(pizza)

        data = []

        for fpizza in random.sample(pizzas,number):
            data.append(Pizza.serialize(fpizza))

        return JsonMessage(body=data)



