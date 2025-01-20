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

# Create your views here.

class ProjectListView(APIView):
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
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
    permission_classes = [IsAuthenticated]
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
       
