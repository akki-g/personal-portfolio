from django.urls import path, include
from .chat import chat
from .views import (
    ProjectListView, 
    ContactView, 
    AboutView, 
    ExperiencesListView, 
    download_resume, 
    get_images, 
    remote_login,
    ssh_connect,
    execute_command,
    list_files
)

urlpatterns = [
    path('api/projects/', ProjectListView.as_view(), name='project-list'),
    path('api/about/', AboutView.as_view(), name='about-list'),
    path('api/contact/', ContactView.as_view(), name='contact-list'),
    path('api/download-resume/', download_resume, name='download-resume'),
    path('api/get_images/', get_images, name='get_images'),
    path('api/experiences/', ExperiencesListView.as_view(), name='experiences-list'),
    path('api/chat/', chat, name='chat'),
    # Remote Access Endpoints
    path('api/remote/login/', remote_login, name='remote-login'),
    path('api/remote/connect/', ssh_connect, name='ssh-connect'),
    path('api/remote/execute/', execute_command, name='execute-command'),
    path('api/remote/files/', list_files, name='list-files'),
]