from django.urls import path
from . import views as code_editor_views

urlpatterns = [
    path('execute_python_code/', code_editor_views.ExecutePythonCodeView.as_view(), name='course_list'),
    #path('<int:course_id>/', course_detail, name='course_detail'),
]