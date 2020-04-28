from django.db import models

from django.contrib.auth.models import User


# Create your models here.
'''
    Classe che modella le informazioni aggiuntive per ogni utente
'''
class UserInformation(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    address = models.CharField(max_length=25)
    phone = models.CharField(max_length=10)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(user_info):
        serialization = {
            "address" : user_info.address,
            "phone" : user_info.phone,
        }

        serialization["user"] = {
            "firstname": user_info.user.first_name,
            "lastname" : user_info.user.last_name,
            "email"  : user_info.user.email,
        }

        return serialization

        