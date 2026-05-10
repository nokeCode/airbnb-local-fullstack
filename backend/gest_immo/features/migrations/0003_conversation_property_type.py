from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('features', '0002_conversation_chatmessage'),
        ('properties', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='conversation',
            name='property',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='conversations', to='properties.property'),
        ),
        migrations.AddField(
            model_name='conversation',
            name='type',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
