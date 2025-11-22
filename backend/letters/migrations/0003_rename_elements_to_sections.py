# letters/migrations/000X_rename_elements_to_sections.py
from django.db import migrations

def rename_elements(apps, schema_editor):
    LT = apps.get_model('letters', 'LetterTemplate')
    for tmpl in LT.objects.all():
        ps = tmpl.pdf_structure or {}
        if 'elements' in ps:
            ps['sections'] = ps.pop('elements')
            tmpl.pdf_structure = ps
            tmpl.save(update_fields=['pdf_structure'])

class Migration(migrations.Migration):
    dependencies = [
        ('letters', '0002_populate_initial_templates'),
    ]

    operations = [
        migrations.RunPython(rename_elements),
    ]