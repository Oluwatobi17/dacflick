# -*- coding: utf-8 -*-
# Generated by Django 1.11.7 on 2019-02-12 22:59
from __future__ import unicode_literals

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('index', '0004_contact_favour_jokeoftheday_likepage_motivationoftheday_notification_oneofakind_quoteoftheday_select'),
    ]

    operations = [
        migrations.AlterField(
            model_name='wall',
            name='user',
            field=models.CharField(max_length=500),
        ),
        migrations.AlterField(
            model_name='wall',
            name='writer',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
