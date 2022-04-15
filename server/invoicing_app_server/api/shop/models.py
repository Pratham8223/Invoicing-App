from django.db import models


# Create your models here.
class Shop(models.Model):
    name = models.CharField(max_length=90)

    logo = models.ImageField(blank=True, null=True, upload_to='shop_logos/')
    website = models.CharField(max_length=70, blank=True, null=True)
    address = models.TextField(max_length=200)

    contact_person_name = models.CharField(default='', max_length=25)
    contact_person_designation = models.CharField(default='', max_length=25)
    contact_person_phone = models.CharField(default='', max_length=13)

    gstin_no = models.CharField(max_length=20)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class Product(models.Model):
    name = models.CharField(max_length=80)

    price = models.FloatField()
    tax = models.FloatField()

    available_stock = models.IntegerField()
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE, default=None, null=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
