from django.urls import path
from .views import api_login, api_logout, verify_user, activate_session

urlpatterns = [
    path('api-login/', api_login),
    path('api-logout/', api_logout),
    path('verify-user/', verify_user),
    path('activate-session/<str:session_id>/', activate_session)
]
