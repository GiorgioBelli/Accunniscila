from django.shortcuts import render
from rest_framework.views import APIView

from django.http import HttpResponse
import json


# Create your views here.
class EmptyAPIView(APIView):
    def get(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite get")
    def head(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite head")
    def post(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite post")
    def put(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite put")
    def delete(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite delete")
    def trace(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite trace")
    def connect(self,request):
        return HttpResponse("non e' possibile richiedere questa pagina tramite connect")

class AuthAPIView(EmptyAPIView):

    def authenticate(self, request):
        # auth procedure #
        if(not request.user.is_authenticated): raise Exception("The user is not logged in")
        return True


class JsonMessage():
    def __init__(self,status=200, message="OK", body={}):
        self.status = status
        self.message = message
        self.body = body

    def parse(self):
        return {"status" : self.status, "message" : self.message, "body" : self.body}


