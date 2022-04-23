from django.db import models
from api.users.models import CustomUser


# Create your models here.
class ActivateSession(models.Model):
    session_id = models.CharField(max_length=40)
    usr = models.ForeignKey(CustomUser, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
