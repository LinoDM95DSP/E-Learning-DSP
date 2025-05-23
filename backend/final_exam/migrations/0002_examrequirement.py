# Generated by Django 5.1.7 on 2025-04-24 07:52

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('final_exam', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='ExamRequirement',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField(help_text='Beschreibung der Anforderung.')),
                ('order', models.PositiveSmallIntegerField(default=0, help_text='Reihenfolge der Anzeige der Anforderung.')),
                ('exam', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='requirements', to='final_exam.exam')),
            ],
            options={
                'verbose_name': 'Exam Requirement',
                'verbose_name_plural': 'Exam Requirements',
                'ordering': ['exam', 'order'],
            },
        ),
    ]
