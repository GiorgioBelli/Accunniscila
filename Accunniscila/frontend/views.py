from django.shortcuts import render


import Orders.views as order_views
from Menu.models import Pizza
from Utilities.views import EmptyAPIView, NoAuthAPIView, AuthAPIView



# Create your views here.

class IndexView(EmptyAPIView):

    def get(self,request):
        return render(request, 'frontend/homepage.html')

    def post(self,request):
        return self.get(request)

class CreaOrdine(AuthAPIView):

    def get(self,request):
        if(not self.authenticated(request)): return render(request, "core/login.html",{"target_page": self.getRequestUrl(request)})
        return render(request, 'frontend/creaOrdine.html')

class Menu(EmptyAPIView):
    
    def get(self,request):
        return render(request, 'frontend/menu.html')

    def post(self,request):
        return self.get(request)

class SignUp(NoAuthAPIView):

    def get(self,request):
        return render(request, 'core/registration.html')
    def post(self,request):
        return self.get(request)

class Login(NoAuthAPIView):

    def get(self,request):
        return render(request, 'core/login.html',{"target_page": self.getRootUrl(request)})
    
    def post(self,request):
        return self.get(request)

class Orders(AuthAPIView):

    def get(self,request):

        if(not self.authenticated(request)): return render(request, "core/login.html",{"target_page": self.getRequestUrl(request)})
        return render(request, 'frontend/ordini.html')
    
    def post(self,request):
        return self.get(request)

class OrderDetails(AuthAPIView):

    def get(self,request,order_id):
        if(not self.authenticated(request)): return render(request, "core/login.html",{"target_page": self.getRequestUrl(request)})
        return render(request, 'frontend/dettaglioOrdine.html',{"order_id": order_id})
    
    def post(self,request,order_id):
        return self.get(request,order_id)

class About(NoAuthAPIView):

    def get(self,request):
        return render(request, 'frontend/about.html')