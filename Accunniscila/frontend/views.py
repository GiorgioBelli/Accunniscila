from django.shortcuts import render

# Create your views here.
def Index(request):
    return render(request, 'frontend/homepage.html')

def CreaOrdine(request):
    return render(request, 'frontend/creaOrdine.html')

def Menu(request):
    return render(request, 'frontend/menu.html')

def SignUp(request):
    return render(request, 'core/registration.html')

def Login(request):
    return render(request, 'core/login.html')