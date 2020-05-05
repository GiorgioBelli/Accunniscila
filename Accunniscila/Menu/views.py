from django.shortcuts import render

from Utilities.views import EmptyAPIView, AuthAPIView, JsonMessage
from .models import Menu, Pizza, Ingredient

from django.http import HttpResponse

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


        menu_pizzas = Menu.objects.get("name")

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


class FillMenu(EmptyAPIView):
    def get(self,request):
        
        ingredients= json.loads('''[
                                {
                                    "name" : "mushroom",
                                    "price" : 2.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "mushroom"
                                },
                                {
                                    "name" : "potato",
                                    "price" : 2.0,
                                    "severity" : 2,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "potato"
                                },
                                    {
                                    "name" : "tomato",
                                    "price" : 5.0,
                                    "severity" : 1,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "tomato"
                                },
                                {
                                    "name" : "olives",
                                    "price" : 2.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "olives"
                                },
                                {
                                    "name" : "wurstel",
                                    "price" : 4.0,
                                    "severity" : 5,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "wurstel"
                                },
                                {
                                    "name" : "fried_potatoes",
                                    "price" : 5.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "fried potatoes"
                                },
                                {
                                    "name" : "mozzarella",
                                    "price" : 0.5,
                                    "severity" : 2,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "mozzarella"
                                }
                            ]''')

        ingredients= json.loads('''[
                                {
                                    "name" : "radicchio",
                                    "price" : 2.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "radicchio"
                                },
                                {
                                    "name" : "zucchini",
                                    "price" : 2.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "zucchine"
                                },
                                    {
                                    "name" : "salami",
                                    "price" : 5.0,
                                    "severity" : 1,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "salame"
                                },
                                {
                                    "name" : "bacon",
                                    "price" : 2.0,
                                    "severity" : 3,
                                    "image" : "http://217.61.121.77/gagosta/phptest/VenvDjango/Accunniscila/Resources/Images/condimenti/funghi.png",
                                    "nameToShow" : "bacon"
                                }
                            ]''')

        data = []
        for ingredient in ingredients:
            i = Ingredient.objects.create(name=ingredient.get("name"),nameToShow=ingredient.get("nameToShow"),price=ingredient.get("price"), severity=ingredient.get("severity"),image = ingredient.get("image"))
            i.save()

        return HttpResponse("OK")