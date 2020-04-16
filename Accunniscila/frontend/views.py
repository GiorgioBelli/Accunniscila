from django.shortcuts import render

# Create your views here.
def index(request):
    return render(request, 'frontend/homepage.html')

def creaOrdine(request):
    return render(request, 'frontend/creaOrdine.html')

def menu(request):
    return render(request, 'frontend/menu.html')