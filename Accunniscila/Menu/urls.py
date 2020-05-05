from django.urls import path
from . import views


urlpatterns = [
    path('api/retrieveIngredients', views.RetrieveIngredients.as_view(), name="RetrieveIngredients" ),
    path('api/retrieveMenu', views.RetrieveMenu.as_view(), name="RetrieveMenu" ),
    path('api/retrieveAvailableMenus', views.RetrieveAvailableMenus.as_view(), name="RetrieveAvailableMenus" ),
    path('api/fillMenu', views.FillMenu.as_view(), name="FillMenu" ),
]