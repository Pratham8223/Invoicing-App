import datetime
import json
import os
import random

from django.contrib.auth import login, logout
from django.core.handlers.wsgi import WSGIRequest
from django.http import JsonResponse, HttpResponse
from rest_framework.authentication import TokenAuthentication, SessionAuthentication, BasicAuthentication
from rest_framework.decorators import permission_classes, authentication_classes, api_view
from rest_framework.permissions import IsAuthenticated

from rest_framework.authtoken.models import Token
from rest_framework.response import Response

from django.views.decorators.csrf import csrf_exempt

from api.users.models import CustomUser
from .models import ActivateSession

from ..mail_helper.mail_helper import send_email


@csrf_exempt
def api_login(request: WSGIRequest):
    if request.method != 'POST':
        return JsonResponse({'err': "invalid http request"}, status=405)

    usr_credentials = json.loads(request.body)

    try:
        usr = CustomUser.objects.get(email=usr_credentials['email'])

        if usr.check_password(usr_credentials['password']):

            # Delete Previous tokens.
            for tkn in Token.objects.filter(user=usr):
                tkn.delete()

            token = Token.objects.create(user=usr)
            login(request, user=usr)
            return JsonResponse({'token': 'Token ' + token.key})
        else:
            return JsonResponse({'err': 'Incorrect password.'}, status=401)

    except Exception as e:
        return JsonResponse({'err': 'Invalid email or password.'}, status=400)


@csrf_exempt
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def api_logout(request: WSGIRequest):
    if 'Authorization' in list(request.headers.keys()):
        tkn = request.headers['Authorization'].split(' ')[-1]

        try:
            del_token = Token.objects.get(user=request.user, key=tkn)
            del_token.delete()
            logout(request)

            return Response({'message': 'Logged out successfully.'})
        except Exception as e:
            return Response({'err': 'invalid user or authtoken'}, status=400)
    else:
        logout(request)
        return Response({'message': 'Logged out successfully.'})


@csrf_exempt
@api_view(['GET'])
@authentication_classes([TokenAuthentication, SessionAuthentication, BasicAuthentication])
@permission_classes([IsAuthenticated])
def verify_user(request: WSGIRequest):
    if request.user.is_email_verified:
        return JsonResponse({'err': 'User already verified!'}, status=400)

    prv_sessions = ActivateSession.objects.filter(usr=request.user, created_at__date=datetime.datetime.now().date())

    if len(prv_sessions) >= 2:
        return JsonResponse({'err': 'Too many active sessions. Can create only two reset session in a day!'}, status=429)
    else:
        ran_str = generate_random_str()
        ActivateSession(session_id=ran_str, usr=request.user).save()
        if send_email(to_email=request.user.email, subject="Email verification.",
                      content="<a href='{}'>Verify Email!</a>".format(
                          os.environ['SELF_URI'] + f'auth/activate-session/{ran_str}/')) == "OK":
            return Response({'message': 'Verification link sent at  : {}.\nPlease check your email.'.format(request.user.email)}, status=200)
        else:
            return Response({'err': 'Unable to send email!'}, status=400)


@csrf_exempt
def activate_session(request: WSGIRequest, session_id: str):
    try:
        session = ActivateSession.objects.get(session_id=session_id)

        session.usr.is_email_verified = True
        session.usr.save()
        return HttpResponse("<title>Verify Email!</title><h3>Successfully verified email : {}. <br/><br/>Please refresh the application.</h3>".format(session.usr.email))

    except Exception as e:
        return HttpResponse("<h1 color='red'>Invalid Session</h1>")


def generate_random_str():
    return ''.join(random.choice('asdfghjklzxcvbnmqwertyuioopASDFGHJKLQWERTYUIOPZXCVBNM741852963') for _ in range(40))
