from django.urls import path
from . import views


urlpatterns = [
    path('api/createOrder', views.CreateOrder.as_view(), name="CreateOrder" ),
    path('api/orders', views.RetrieveOrders.as_view(), name="RetrieveOrders" ),
    path('api/orders/<int:order>', views.RetrieveOrderDetails.as_view(), name="RetrieveOrderDetails" ),
    path('api/orders/<int:order>/update', views.UpdateOrder.as_view(), name="UpdateOrder" ),
]