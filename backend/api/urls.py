from django.urls import path, include
from .views import (
    ProjectListView, 
    ContactView, 
    AboutView, 
    ExperiencesListView, 
    download_resume, 
    get_images, 
    proxy_to_perplexity,
    proxy_to_openai
)

urlpatterns = [
    path('api/projects/', ProjectListView.as_view(), name='project-list'),
    path('api/about/', AboutView.as_view(), name='about-list'),
    path('api/contact/', ContactView.as_view(), name='contact-list'),
    path('api/download-resume/', download_resume, name='download-resume'),
    path('api/get_images/', get_images, name='get_images'),
    path('api/experiences/', ExperiencesListView.as_view(), name='experiences-list'),
    path('api/proxy_to_perplexity/', proxy_to_perplexity, name='proxy_to_perplexity'),
    path('api/proxy_to_openai/', proxy_to_openai, name='proxy_to_openai')
]