from django.db import models
from django.db.models import JSONField
from ckeditor.fields import RichTextField
import os

# Create your models here.

class Project(models.Model):
    title = models.CharField(max_length=100)
    monthyr = models.CharField(max_length=100)
    short_desc = models.TextField(default='Short description of the project')
    description = models.TextField(default='Longer description of the project')
    content = JSONField(blank=True, null=True)
    repo_link = models.URLField(max_length=200, blank=True, null=True)
    live_link = models.URLField(max_length=200, blank=True, null=True)
    technologies = models.TextField(default='Technologies used in the project')



    def __str__(self): 
        return self.title
    
class Contact(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class About(models.Model):
    def resume_upload_to(instance, filename):
        # Define the custom name for the resume
        base_filename, file_extension = os.path.splitext(filename)
        new_filename = f"AkshatGuduru_Resume{file_extension}"
        return f"files/{new_filename}"
    linkedIn = models.ImageField(upload_to='images/', blank=True, null=True)
    github_light = models.ImageField(upload_to='images/', blank=True, null=True)
    github_dark = models.ImageField(upload_to='images/', blank=True, null=True)
    image1 = models.ImageField(upload_to='images/', blank=True, null=True)
    image2 = models.ImageField(upload_to='images/', blank=True, null=True)
    image3 = models.ImageField(upload_to='images/', blank=True, null=True)
    image4 = models.ImageField(upload_to='images/', blank=True, null=True)
    resume = models.FileField(upload_to=resume_upload_to, blank=True, null=True)

    def __str__(self):
        return 'About'
