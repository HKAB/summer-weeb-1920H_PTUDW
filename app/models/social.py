from django.db import models
from django_prometheus.models import ExportModelOperationsMixin
from .student import Student


class Social(ExportModelOperationsMixin('social'), models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    social_type = models.CharField(max_length=64)
    social_url = models.CharField(max_length=1024, default='#')
