from django.contrib import admin

# Register your models here.
from .models import Slice, PizzaIngredients, Pizza, Menu, Ingredient

admin.site.register(Ingredient)
admin.site.register(Slice)
admin.site.register(PizzaIngredients)
admin.site.register(Pizza)
admin.site.register(Menu)