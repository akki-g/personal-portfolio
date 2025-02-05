from django.shortcuts import render
from django.http import FileResponse
from django.contrib.sites.shortcuts import get_current_site
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Project, Contact, About, Experience
from .serializers import ProjectSerializer, ContactSerializer, AboutSerializer, ExperienceSerializer
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import os
import json
# Create your views here.

class ProjectListView(APIView):

    def get(self, request):
        projects = Project.objects.all()
        serializer = ProjectSerializer(projects, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

class ContactView(APIView):

    def get(self, request):
        contacts = Contact.objects.all()
        serializer = ContactSerializer(contacts, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class AboutView(APIView):

    def get(self, request):
        about = About.objects.all()
        serializer = AboutSerializer(about, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = AboutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
class ExperiencesListView(APIView):

    def get(self, request):
        projects = Experience.objects.all()
        serializer = ExperienceSerializer(projects, many=True)
        return Response(serializer.data)
    def post(self, request):
        serializer = ExperienceSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)
    
def download_resume(request):
    about = get_object_or_404(About, pk=1)

    return FileResponse(about.resume, as_attachment=True, filename='AkshatGuduru_Resume.pdf')

@api_view(['GET'])
def get_images(request):
    about = get_object_or_404(About, pk=1)
    current_site = get_current_site(request)
    domain = f"{request.scheme}://{current_site.domain}"
    return Response({
        'image_1': domain + about.image1.url,
        'image_2': domain + about.image2.url,
        'image_3': domain + about.image3.url,
        'image_4': domain + about.image4.url
    })
csrf_exempt
def proxy_to_perplexity(request):
    if request.method == "POST":
        api_url = "https://api.perplexity.ai/chat/completions"
        headers = {
            "Authorization": f"Bearer {os.getenv('PERLEX_TOKEN')}",
            "Content-Type": "application/json",
        }
        try:
            payload = json.loads(request.body.decode('utf-8'))
            response = requests.post(api_url, headers=headers, json=payload)
            return JsonResponse(response.json(), status=response.status_code)
        except json.JSONDecodeError as e:
            return JsonResponse({"error": "Invalid JSON payload", "details": str(e)}, status=400)
        except requests.RequestException as e:
            return JsonResponse({"error": "Error communicating with Perplexity API", "details": str(e)}, status=502)
        except Exception as e:
            return JsonResponse({"error": "Internal server error", "details": str(e)}, status=500)
    return JsonResponse({"error": "Invalid request method"}, status=405)
