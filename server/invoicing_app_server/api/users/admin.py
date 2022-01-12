from django.contrib import admin
from .models import CustomUser, OTPSession

# Register your models here.
admin.site.register(CustomUser)
admin.site.register(OTPSession)
