from django.urls import path
from .views import api_login, api_logout, verify_user

urlpatterns = [
    path('api-login/', api_login),
    path('api-logout/', api_logout),
    path('verify-user/', verify_user)
]
