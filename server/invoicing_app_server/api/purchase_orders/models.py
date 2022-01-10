from django.db import models
from ..shop.models import Shop, Product


# Create your models here.
class PurchaseOrder(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)

    subtotal = models.FloatField()
    tax = models.FloatField()
    discount = models.FloatField()

    invoice_no = models.BigIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class POItem(models.Model):
    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)

    cost = models.FloatField()
    discount = models.FloatField()
    tax = models.FloatField()

    quantity = models.FloatField()

    amount = models.FloatField()

    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
