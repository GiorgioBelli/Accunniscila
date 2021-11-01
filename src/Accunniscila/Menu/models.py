from django.db import models

# Create your models here.

'''
    Classe che modella gli ingredienti
'''
class Ingredient(models.Model):
    name = models.CharField(primary_key=True, max_length=50, null=False)
    nameToShow = models.CharField(max_length=50, null=False, default="")
    price = models.FloatField(null=False, default=0)
    severity = models.IntegerField(null=False, default=0)
    image = models.CharField(max_length=200, null=False)

    #Serializza il modello per la conversione in json
    @staticmethod
    def serialize(ingredient):
        return {
            "name" : ingredient.name,
            "nameToShow" : ingredient.nameToShow,
            "price" : ingredient.price,
            "severity" : ingredient.severity,
            "image" : ingredient.image
        }

    #Metodo che verifica l'esistenza di un ingrediente con il nome specificato
    @staticmethod
    def exists(name):
        try:
            ingredient = Ingredient.objects.get(name=name)
        except Ingredient.DoesNotExist:
            return False
        return True

'''
    Classe che modella i tipi di gusti (1,2,3 etc..)
'''
class Slice(models.Model):
    number = models.IntegerField(primary_key=True, null=False)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(pslice):
        return {
            "number" : pslice.number
        }

    '''Metodo che verifica l'esistenza di un tipo di gusto con il numero specificato'''
    @staticmethod
    def exists(number):
        try:
            _slice = Slice.objects.get(number=number)
        except Slice.DoesNotExist:
            return False
        return True

'''
    Classe che modella la posizione dei vari ingredienti sulla pizza
'''
class PizzaIngredients(models.Model):
    ingredient = models.ForeignKey(Ingredient,on_delete=models.CASCADE)
    pslice = models.ForeignKey(Slice, on_delete=models.CASCADE)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(pizza_ingredient):
        return {
            "ingredient" : Ingredient.serialize(pizza_ingredient.ingredient),
            "slice" : Slice.serialize(pizza_ingredient.pslice),
        }

'''
    Classe che modella una Pizza
'''
class Pizza(models.Model):
    name = models.CharField(max_length=51, null=False)
    image = models.CharField(max_length=200, null=True)
    totalSlices = models.IntegerField(default=1)
    pizzaIngredients = models.ManyToManyField(PizzaIngredients)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(pizza):
        serialization = {
            "name" : pizza.name,
            "slices" : pizza.totalSlices,
            "image_path" : pizza.image,

        }
        
        serialization["chosenIngredients"] = []
        for pizza_ingredient in pizza.pizzaIngredients.all():
            serialization["chosenIngredients"].append(PizzaIngredients.serialize(pizza_ingredient))

        return serialization

    '''Metodo che verifica l'esistenza di una pizza con il nome specificato'''
    @staticmethod
    def exists(name):
        try:
            pizza = Pizza.objects.get(name=name)
        except Pizza.DoesNotExist:
            return False
        return True

'''
    Classe che modella un Menù
'''
class Menu(models.Model):
    name = models.CharField(primary_key=True, max_length=50, null=False)
    pizzas = models.ManyToManyField(Pizza)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(menu):
        serialization = {
            "name" : menu.name,
        }

        serialization["pizzas"] = []
        for pizza in menu.pizzas.all():
            serialization["pizzas"].append(Pizza.serialize(pizza))

        return serialization

    '''Metodo che verifica l'esistenza di un menu con il nome specificato'''
    @staticmethod
    def exists(name):
        try:
            menu = Menu.objects.get(name=name)
        except Menu.DoesNotExist:
            return False
        return True