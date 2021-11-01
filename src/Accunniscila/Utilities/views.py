from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
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

    def getRequestUrl(self,request):
        protocol = "https" if request.is_secure() else "http"
        requester_page = protocol+"://"+request.get_host()+request.get_full_path()

        return requester_page

    def getRootUrl(self,request):
        protocol = "https" if request.is_secure() else "http"
        root_page = protocol+"://"+request.get_host()

        return root_page



class NoAuthAPIView(EmptyAPIView):

    def not_authenticated(self, request):
        return not request.user.is_authenticated

class AuthAPIView(EmptyAPIView):

    def authenticated(self, request):
        return request.user.is_authenticated

class JsonMessage(JsonResponse):
    def __init__(self,status=200, result_msg="OK", body={}):
        super().__init__(status=status,data={"result_msg":result_msg,"body":body},safe=False)


