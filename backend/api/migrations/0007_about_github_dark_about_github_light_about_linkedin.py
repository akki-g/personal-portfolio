# Generated by Django 5.1.4 on 2025-01-08 01:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_about'),
    ]

    operations = [
        migrations.AddField(
            model_name='about',
            name='github_dark',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='about',
            name='github_light',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='about',
            name='linkedIn',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
    ]
