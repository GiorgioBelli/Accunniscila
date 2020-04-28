from django.shortcuts import render


import Orders.views as order_views
from Menu.models import Pizza
from Utilities.views import EmptyAPIView



# Create your views here.

class IndexView(EmptyAPIView):

    def get(self,request):
        return render(request, 'frontend/homepage.html')

    def post(self,request):
        return self.get(request)

class CreaOrdine(EmptyAPIView):

    def get(self,request):
        return render(request, 'frontend/creaOrdine.html')

class Menu(EmptyAPIView):
    
    def get(self,request):
        return render(request, 'frontend/menu.html')

    def post(self,request):
        return self.get(request)

class SignUp(EmptyAPIView):

    def get(self,request):
        return render(request, 'core/registration.html')
    def post(self,request):
        return self.get(request)

class Login(EmptyAPIView):

    def get(self,request):
        return render(request, 'core/login.html')
    
    def post(self,request):
        return self.get(request)

        
