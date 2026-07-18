from django.db import migrations, models


def replace_focus_period_em_dashes(apps, schema_editor):
    About = apps.get_model('api', 'About')
    em_dash = '\u2014'

    for about in About.objects.filter(current_focus_period__contains=em_dash):
        about.current_focus_period = about.current_focus_period.replace(em_dash, ' to ')
        if about.current_focus_period == '2024 to Now':
            about.current_focus_period = '2024 to present'
        about.save(update_fields=['current_focus_period'])


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0005_about_home_focus_fields_and_remove_legacy_fields'),
    ]

    operations = [
        migrations.AlterField(
            model_name='about',
            name='current_focus_period',
            field=models.CharField(blank=True, default='2024 to present', max_length=80),
        ),
        migrations.RunPython(replace_focus_period_em_dashes, migrations.RunPython.noop),
    ]
