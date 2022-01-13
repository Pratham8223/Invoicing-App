import re

from django.core.handlers.wsgi import WSGIRequest
from rest_framework.authentication import TokenAuthentication
from rest_framework.decorators import authentication_classes, api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from api.shop.models import Shop
from api.shop.serializers import ShopSerializer


@api_view(['GET', 'POST'])
@authentication_classes([TokenAuthentication])
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
                return Response({'err': "shop already exists"}, status=400)

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
            return Response({'err': str(e)})

        return Response(ShopSerializer(shop_obj, context={'request': request}).data)


@api_view(['PUT'])
@authentication_classes([TokenAuthentication])
@permission_classes([IsAuthenticated])
def shop_id(request: WSGIRequest, id: int):
    pass
