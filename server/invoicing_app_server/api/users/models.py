from django.db import models
from django.contrib.auth.models import AbstractUser
from ..shop.models import Shop


# Create your models here.
class CustomUser(AbstractUser):
    username = None
    phone = models.CharField(max_length=13, default='', unique=True)
    email = models.EmailField(max_length=50, unique=True)

    is_email_verified = models.BooleanField(default=False)
    # is_phone_verified = models.BooleanField(default=False)

    shop = models.OneToOneField(Shop, null=True, on_delete=models.SET_NULL)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['shop']


class OTPSession(models.Model):
    otp_type = models.CharField(max_length=20)
    otp = models.CharField(max_length=6)

    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
