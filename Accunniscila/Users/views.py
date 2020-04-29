from django.shortcuts import render

# Create your views here.
import json
from django.contrib.auth import authenticate, login, logout, get_user
from Utilities.views import EmptyAPIView,NoAuthAPIView, AuthAPIView, JsonMessage
from django.http import JsonResponse, HttpResponse
from .models import UserInformation

from django.shortcuts import redirect


class check(EmptyAPIView):
    def post(self,request):
        return HttpResponse(get_user(request))

class Logout(AuthAPIView):

    def post(self,request):

        if(not self.authenticated(request)): return JsonResponse(JsonMessage(status=400,message="user not autenticated").parse(),status=400,safe=False)

        logout(request)
        return JsonResponse(
                JsonMessage(status=200,message="user logged out ").parse(),
                safe=False
                )

class Login(NoAuthAPIView):

    def post(self,request):

        if(not self.not_authenticated(request)): return JsonResponse(JsonMessage(status=400,message="user already autenticated").parse(),status=400,safe=False)

        body = json.loads(request.body)

        username = body.get("username")
        password = body.get("password")
        

        # errorMessage = JsonMessage(status=403,message="{} don't/doesn't have the correct format")
        # errors_list = []

        # if( not UserInformation.validateUsernameCriteria(username)): errors_list.append("username")
        # if( not UserInformation.validatePassworCriteria(password)): errors_list.append("password")

        # if(errors_list): 
        #     errorMessage.message = errorMessage.message.format(" and ".join(errors_list))
        #     return JsonResponse(errorMessage.parse(),safe=False)

        if(not UserInformation.validateUsernameCriteria(username) or not UserInformation.validatePassworCriteria(password)):
            return JsonResponse(
                JsonMessage(status=400,message="username or/and password doesn't have the correct format").parse(),
                status=400,
                safe=False
                )
        

        user = authenticate(request, username=username, password=password)
        if user is not None:
            # Redirect to a success page.
            login(request, user)
            return JsonResponse(JsonMessage(message="autenticated ").parse(),safe=False)
        else:
            # Return an 'invalid login' error message.
            return JsonResponse(JsonMessage(status=400,message="incorrect username or password").parse(),status=400,safe=False)
            
