from django.shortcuts import render
from django.http import HttpResponse
import json

from django.views import View

from django.contrib.auth import get_user


# Create your views here.
class EmptyAPIView(View):
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


class NoAuthAPIView(EmptyAPIView):

    def not_authenticated(self, request):
        return not request.user.is_authenticated

class AuthAPIView(EmptyAPIView):

    def authenticated(self, request):
        return request.user.is_authenticated


class JsonMessage():
    def __init__(self,status=200, message="OK", body={}):
        self.status = status
        self.message = message
        self.body = body

    def parse(self):
        return {"status" : self.status, "message" : self.message, "body" : self.body}


