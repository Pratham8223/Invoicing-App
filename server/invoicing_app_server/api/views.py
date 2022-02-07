import datetime

from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from django.core.handlers.wsgi import WSGIRequest
from django.http.response import JsonResponse

from api.purchase_orders.models import PurchaseOrder, POItem
from api.purchase_orders.serializers import PurchaseOrderSerializer, POItemSerializer
from api.shop.models import Product
from api.shop.serializers import ProductSerializer, ShopSerializer
from api.users.serializers import CustomUserSerializer

"""
    MAYBE IN FUTURE : Add pagination.. 
"""


# Create your views here.
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def home(request: WSGIRequest):
    res = {'user': CustomUserSerializer(request.user).data,
           'products': ProductSerializer(Product.objects.filter(shop=request.user.shop), many=True).data}

    # Extend shop obj
    res['user']['shop'] = ShopSerializer(request.user.shop, context={'request': request}).data

    # Purchase Orders...
    u_pos_serialized = PurchaseOrderSerializer(
        PurchaseOrder.objects.filter(shop=request.user.shop, created_at__year=int(datetime.datetime.now().year),
                                     created_at__month=int(datetime.datetime.now().month)), many=True).data
    for i in u_pos_serialized:
        i['po_items'] = POItemSerializer(POItem.objects.filter(purchase_order__id=i['id']), many=True).data
    res['purchase_orders'] = u_pos_serialized

    # Sales Data Yearly
    yearly_data = []
    for i in range(1, 13):
        yearly_data.append(sum([i[0] for i in
                                PurchaseOrder.objects.filter(
                                    shop=request.user.shop,
                                    created_at__year=datetime.datetime.now().year,
                                    created_at__month=i).values_list('subtotal')]))

    res['yearly_data'] = yearly_data

    return Response(res)


def handler404(request: WSGIRequest, exception):
    return JsonResponse({'err': 'Invalid route : ' + request.path}, status=404)


def handler500(request):
    return JsonResponse({'err': 'internal server error.'}, status=404)
