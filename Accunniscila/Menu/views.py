from django.shortcuts import render

from Utilities.views import EmptyAPIView, AuthAPIView, JsonMessage
from .models import Ingredient, Menu, Pizza

from django.http import JsonResponse

import json

# Create your views here.

class RetrieveIngredients(AuthAPIView):
    def post(self,request):
        ingredients = Ingredient.objects.all()
        
        data=[]
        for ingredient in ingredients:
            data.append(Ingredient.serialize(ingredient))

        return JsonResponse(
            JsonMessage(body=data).parse(),
            safe=False
        )

class RetrieveMenu(EmptyAPIView):
    def post(self,request):

        body = json.loads(request.body)

        name = body.get("name")

        try: Menu.exists(name)
        except Exception:
            return JsonResponse(
                JsonMessage(status="404",message="Un'able to find menu {}".format(name)).parse(),
                safe=False
                )


        menu_pizzas = Menu.objects.get("name")

        data = []
        for pizza in menu_pizzas.pizzas:
            data.append(Pizza.serialize(pizza))

        return JsonResponse(
            JsonMessage(body=data).parse(),
            safe=False
        )

class RetrieveAvailableMenus(EmptyAPIView):
    def post(self,request):
        menus = Menu.objects.all()

        data = []
        for menu in menus:
            data.append(Menu.serialize(menu))

        return JsonResponse(
            JsonMessage(body=data).parse(),
            safe=False
        )