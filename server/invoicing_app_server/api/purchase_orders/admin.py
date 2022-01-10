from django.contrib import admin
from .models import PurchaseOrder, POItem

# Register your models here.
admin.site.register(PurchaseOrder)
admin.site.register(POItem)
