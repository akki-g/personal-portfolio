from django.contrib import admin
from .models import Project, Contact, About, Experience
# Register your models here.

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'monthyr', 'technologies']
    search_fields = ['title', 'monthyr', 'technologies']
    list_filter = ['monthyr']

@admin.register(Contact)
class ContactAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'message_snippet', 'timestamp']
    search_fields = ['name', 'email', 'message']
    list_filter = ['timestamp']

    def message_snippet(self, obj):
        return obj.message[:50]
    message_snippet.short_description = 'Message Preview'

@admin.register(About)
class AboutAdmin(admin.ModelAdmin):
    list_display = ['title', 'current_focus_title', 'availability_text', 'resume']
    search_fields = ['title', 'current_focus_title', 'availability_text']

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ['title', 'company', 'role', 'start_mthyr', 'end_mthyr']
    search_fields = ['title', 'company', 'role', 'start_mthyr', 'end_mthyr']
    list_filter = ['start_mthyr', 'end_mthyr']
