# Generated by Django 5.1.5 on 2025-01-20 20:00

import api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_contact_timestamp'),
    ]

    operations = [
        migrations.CreateModel(
            name='Experience',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=100)),
                ('company', models.CharField(max_length=100)),
                ('role', models.CharField(max_length=100)),
                ('start_mthyr', models.CharField(max_length=100)),
                ('end_mthyr', models.CharField(max_length=100)),
                ('description', models.TextField(default='Description of the experience')),
            ],
        ),
        migrations.DeleteModel(
            name='Social',
        ),
        migrations.RemoveField(
            model_name='about',
            name='content',
        ),
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
            name='image1',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.About.image_1_upload_to),
        ),
        migrations.AddField(
            model_name='about',
            name='image2',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.About.image_2_upload_to),
        ),
        migrations.AddField(
            model_name='about',
            name='image3',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.About.image_3_upload_to),
        ),
        migrations.AddField(
            model_name='about',
            name='image4',
            field=models.ImageField(blank=True, null=True, upload_to=api.models.About.image_4_upload_to),
        ),
        migrations.AddField(
            model_name='about',
            name='linkedIn',
            field=models.ImageField(blank=True, null=True, upload_to='images/'),
        ),
        migrations.AddField(
            model_name='about',
            name='resume',
            field=models.FileField(blank=True, null=True, upload_to=api.models.About.resume_upload_to),
        ),
        migrations.AddField(
            model_name='project',
            name='short_desc',
            field=models.TextField(default='Short description of the project'),
        ),
        migrations.AlterField(
            model_name='about',
            name='title',
            field=models.CharField(default='About Me', max_length=100),
        ),
        migrations.AlterField(
            model_name='project',
            name='description',
            field=models.TextField(default='Longer description of the project'),
        ),
        migrations.AlterField(
            model_name='project',
            name='technologies',
            field=models.TextField(default='Technologies used in the project'),
        ),
    ]
