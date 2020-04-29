from django.db import models

from django.contrib.auth.models import User

import re

# Create your models here.
'''
    Classe che modella le informazioni aggiuntive per ogni utente
'''
class UserInformation(models.Model):
    user = models.OneToOneField(User, on_delete = models.CASCADE)
    phone = models.CharField(max_length=10)

    '''Serializza il modello per la conversione in json'''
    @staticmethod
    def serialize(user_info):
        serialization = {
            "phone" : user_info.phone,
        }

        serialization["user"] = {
            "firstname": user_info.user.first_name,
            "lastname" : user_info.user.last_name,
            "email"  : user_info.user.email,
        }

        return serialization

    '''Valida criteri minimi username'''
    @staticmethod
    def validateUsernameCriteria(username):
        return re.match("^(?=.{6,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$",username)

    '''Valida criteri minimi password'''
    def validatePassworCriteria(password):
        return re.match("^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$",password) # almeno 1 upper letter, 1 lower letter, 1 number , minimo 8 caratteri

    '''Valida criteri minimi email'''
    def validateEmailCriteria(email):
        return re.match("^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$",email)