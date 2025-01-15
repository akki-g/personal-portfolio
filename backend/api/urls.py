from django.urls import path, include
from .views import ProjectListView, ContactView, AboutView, download_resume

urlpatterns = [
    path('api/projects/', ProjectListView.as_view(), name='project-list'),
    path('api/about/', AboutView.as_view(), name='about-list'),
    path('api/contact/', ContactView.as_view(), name='contact-list'),
    path('api/download-resume/', download_resume, name='download-resume')
]