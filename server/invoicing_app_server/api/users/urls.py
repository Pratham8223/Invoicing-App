from django.urls import path
from .views import user, user_id, api_login, api_logout

urlpatterns = [
    path('', user),
    path('<int:id>/', user_id),
    path('api-login/', api_login),
    path('api-logout/', api_logout),
]
