from django.shortcuts import render

# Create your views here.
import json
from django.contrib.auth import authenticate, login, logout, get_user
import crypt
from django.contrib.auth.models import User

from Utilities.views import EmptyAPIView,NoAuthAPIView, AuthAPIView, JsonMessage
from django.http import HttpResponse
from .models import UserInformation

from django.shortcuts import redirect


class check(EmptyAPIView):
    def post(self,request):
        return HttpResponse(get_user(request))

class Logout(AuthAPIView):
    '''
        Effettua il logout dell'utente
    '''

    def post(self,request):

        if(not self.authenticated(request)): return JsonMessage(status=400,result_msg="user not autenticated")

        logout(request)
        return JsonMessage(status=200,result_msg="user logged out ")

class Login(NoAuthAPIView):
    '''
        Effettua il login dell'utente che lo richiede

        Expected json { 
                "email" : email,
                "password" : password,
                "remember_me" : true/false
            }

    '''

    def post(self,request):

        if(not self.not_authenticated(request)): return JsonMessage(status=400,result_msg="user already autenticated")

        body = json.loads(request.body)

        email = body.get("email")
        password = body.get("password")
        remember_me = body.get("remember_me")

        if(not UserInformation.validateEmailCriteria(email) or not UserInformation.validatePassworCriteria(password)):
            return JsonMessage(status=400,result_msg="email or/and password doesn't have the correct format")
        
        try: tmp_user = User.objects.get(email=email)
        except: return JsonMessage(status=400,result_msg="incorrect email or password")

        user = authenticate(request, username=tmp_user.username, password=password)
        if user is not None:
            # Redirect to a success page.
            login(request, user)
            if(not remember_me): 
                request.session.set_expiry(0) #session restart after browser is closed 
            return JsonMessage(result_msg="autenticated")
        else:
            # Return an 'invalid login' error message.
            return JsonMessage(status=400,result_msg="incorrect email or password")


class Register(NoAuthAPIView):
    '''
        Registra un utente sul sistema e lo fa accedere

        Expected json { 
                "first_name" : first_name,
                "email" : email,
                "password" : password,
                "phone_number" : phone_number,
            }

    '''

    def post(self,request):

        if(not self.not_authenticated(request)): return JsonMessage(status=400,result_msg="user already autenticated")

        body = json.loads(request.body)

        first_name = body.get("first_name")
        last_name = body.get("last_name")
        email = body.get("email")
        password = body.get("password")
        phone_number = body.get("phone_number")

        if(not UserInformation.validateEmailCriteria(email) or not UserInformation.validatePassworCriteria(password)):
            return JsonMessage(status=400,result_msg="email or/and password doesn't have the correct format")

        try: 
            tmp_user = User.objects.get(email=email)
            if(tmp_user is not None): return JsonMessage(status=400,result_msg="email already exists")
        except: 
            pass

        rnd_username = crypt.crypt(email,crypt.mksalt(crypt.METHOD_CRYPT))
        
        user = User.objects.create_user(username=rnd_username,first_name=first_name,last_name=last_name,email=email,password=password)
        user.save()

        user_info = UserInformation.objects.create(phone=phone_number,user=user)
        user_info.save()

        login(request,user)
        return JsonMessage(result_msg="successfully registered")
            
