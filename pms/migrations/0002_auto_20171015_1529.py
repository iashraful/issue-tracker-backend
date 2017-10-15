# -*- coding: utf-8 -*-
# Generated by Django 1.11.4 on 2017-10-15 09:29
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('pms', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conversation',
            name='comment',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='pms.Comment'),
        ),
        migrations.AlterField(
            model_name='conversation',
            name='issue',
            field=models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='pms.Issue'),
        ),
    ]
