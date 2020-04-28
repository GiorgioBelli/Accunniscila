from django.contrib import admin

# Register your models here.
from .models import Ingredient, Slice, PizzaIngredients, Pizza, Menu

admin.site.register(Ingredient)
admin.site.register(Slice)
admin.site.register(PizzaIngredients)
admin.site.register(Pizza)
admin.site.register(Menu)