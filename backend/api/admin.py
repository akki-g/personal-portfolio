from django.contrib import admin
from .models import Project, Contact, About, Experience
# Register your models here.

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ['title', 'monthyr', 'on_timeline']
    search_fields = ['title', 'monthyr', 'technologies', 'summary']
    list_filter = ['monthyr']
    fieldsets = [
        (None, {'fields': ['title', 'monthyr', 'technologies', 'repo_link', 'live_link']}),
        ('Home page timeline', {'fields': ['summary']}),
        ('Full experience page', {'fields': ['short_desc', 'description', 'content']}),
    ]

    @admin.display(boolean=True, description='On timeline')
    def on_timeline(self, obj):
        return bool(obj.summary.strip())

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
    list_display = ['title', 'company', 'type', 'start_mthyr', 'end_mthyr', 'on_timeline']
    search_fields = ['title', 'company', 'role', 'start_mthyr', 'end_mthyr', 'summary']
    list_filter = ['type', 'start_mthyr', 'end_mthyr']
    fieldsets = [
        (None, {'fields': ['type', 'title', 'company', 'role', 'start_mthyr', 'end_mthyr']}),
        ('Home page timeline', {'fields': ['summary']}),
        ('Full experience page', {'fields': ['description']}),
    ]

    @admin.display(boolean=True, description='On timeline')
    def on_timeline(self, obj):
        return bool(obj.summary.strip())
