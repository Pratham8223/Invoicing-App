from django.db import models
from django.contrib.auth.models import AbstractUser
from ..shop.models import Shop


# Create your models here.
class CustomUser(AbstractUser):
    username = None
    phone = models.CharField(max_length=13, default='')
    email = models.EmailField(max_length=50, unique=True)

    shop = models.OneToOneField(Shop, null=True, on_delete=models.SET_NULL)

    USERNAME_FIELD = 'email'

    REQUIRED_FIELDS = ['shop']
