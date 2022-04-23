import json
import re

from django.core.handlers.wsgi import WSGIRequest
from django.views.decorators.csrf import csrf_exempt
from rest_framework.authentication import TokenAuthentication, BasicAuthentication, SessionAuthentication
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.shop.models import Shop, Product
from api.shop.serializers import ShopSerializer, ProductSerializer


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def shop(request: WSGIRequest):
    if request.method == 'GET':
        usr_shop = request.user.shop

        if usr_shop is None:
            return Response({'err': 'No associated shop found with user.'}, status=404)
        else:
            return Response(ShopSerializer(usr_shop, context={'request': request}).data)

    if request.method == 'POST':
        nw_shop = dict(request.POST.items())

        # Validations
        try:
            if request.user.shop is not None:
                return Response({'err': "Shop already exists, try editing shop else."}, status=400)

            if not bool(re.match('[a-zA-Z\s]+$', nw_shop['name'])):
                return Response({'err': 'name of shop cannot have special characters.'}, status=400)

            if len(nw_shop['address']) < 10:
                return Response({'err': 'must be bigger than 10 chars'})

        except Exception as e:
            return Response({'err': str(e)}, status=400)

        shop_obj = Shop()
        try:
            for key, val in nw_shop.items():
                if key not in ['logo']:
                    setattr(shop_obj, key, val)

            try:
                shop_obj.logo = request.FILES['logo']
            except:
                pass

            request.user.shop = shop_obj
            request.user.shop.save()
            request.user.save()
        except Exception as e:
            return Response({'err': str(e)}, status=400)

        return Response(ShopSerializer(shop_obj, context={'request': request}).data)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def shop_id(request: WSGIRequest, id: int):
    # NOTE : User form-data at frontend

    if id != request.user.shop.id:
        return Response({'err': 'Invalid shop id.'}, status=400)

    try:
        for key, val in request.data.items():

            if key == 'name':
                if not bool(re.match('[a-zA-Z\s]+$', val)):
                    return Response({'err': 'Name of shop cannot have special characters.'}, status=400)
            setattr(request.user.shop, key, val)

            if key == 'address':
                if len(val) < 10:
                    return Response({'err': 'Must be bigger than 10 chars.'}, status=400)
            setattr(request.user.shop, key, val)

        try:
            request.user.shop.logo = request.FILES['logo']
        except Exception:
            pass

        request.user.shop.save()
        return Response(ShopSerializer(request.user.shop, context={'request': request}).data)

    except Exception as e:
        return Response({'err': str(e)}, status=400)


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def product(request: WSGIRequest):
    if request.method == 'GET':
        return Response(ProductSerializer(Product.objects.filter(shop=request.user.shop), many=True).data)

    if request.method == 'POST':
        nw_product = json.loads(request.body)

        try:
            if len(nw_product['name']) < 4:
                return Response({'err': 'product_name too short.'}, status=400)

            if nw_product['price'] < 0:
                return Response({'err': 'price cannot be negative.'}, status=400)

            if nw_product['tax'] < 0:
                return Response({'err': 'tax cannot be negative'}, status=400)

            if nw_product['available_stock'] < 0:
                return Response({'err': 'available_stock cannot be negative'}, status=400)

        except Exception as e:
            return Response({'err': str(e)}, status=400)

        try:
            nw_product_obj = Product(
                name=nw_product['name'],
                price=nw_product['price'],
                tax=nw_product['tax'],
                available_stock=nw_product['available_stock'],
                shop=request.user.shop
            )
            nw_product_obj.save()
            return Response(ProductSerializer(nw_product_obj).data)

        except Exception as e:
            return Response({'err': str(e)}, status=400)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def product_id(request: WSGIRequest, id: int):
    edit_product_body = json.loads(request.body)

    try:
        edit_product_obj = Product.objects.get(id=id, shop=request.user.shop)

        for key, val in edit_product_body.items():
            if key == 'name':
                if len(val) < 4:
                    return Response({'err': 'product_name too short.'}, status=400)
                setattr(edit_product_obj, key, val)

            if key == 'price':
                if val < 0:
                    return Response({'err': 'price cannot be negative.'}, status=400)
                setattr(edit_product_obj, key, val)

            if key == 'tax':
                if val < 0:
                    return Response({'err': 'tax cannot be negative'}, status=400)
                setattr(edit_product_obj, key, val)

            setattr(edit_product_obj, key, val)

        edit_product_obj.save()
        return Response(ProductSerializer(edit_product_obj).data)

    except Exception as e:
        return Response({'err': str(e)}, status=400)
