from django.urls import path
from . import views as user_views
from .views.auth_views import LogoutView

app_name = 'users'

urlpatterns = [
    #path('', course_list, name='course_list'),
    #path('<int:course_id>/', course_detail, name='course_detail'),
    path('logout/', LogoutView.as_view(), name='logout'),
]