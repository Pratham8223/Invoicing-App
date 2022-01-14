from django.db import models
from ..shop.models import Shop, Product


# Create your models here.
class PurchaseOrder(models.Model):
    shop = models.ForeignKey(Shop, on_delete=models.CASCADE)

    customer_name = models.CharField(max_length=40, default=None, null=True)

    subtotal = models.FloatField(default=0.0)
    tax = models.FloatField(default=0.0)
    discount = models.FloatField(default=0.0)

    invoice_no = models.BigIntegerField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


class POItem(models.Model):

    product_name = models.CharField(max_length=50, default='')

    product = models.ForeignKey(Product, null=True, on_delete=models.SET_NULL)

    cost = models.FloatField()
    discount = models.FloatField()
    tax = models.FloatField()

    quantity = models.FloatField()

    amount = models.FloatField()

    purchase_order = models.ForeignKey(PurchaseOrder, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
