from django.contrib import admin

# Register your models here.
from .models import UserInformation

admin.site.register(UserInformation)