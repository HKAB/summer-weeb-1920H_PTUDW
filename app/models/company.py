from django.db import models

from .account import Account
from .student import Student
from .specialty import Specialty


def store_picture(instance, filename: str) -> str:
    extension = filename.split('.')[-1]
    return "profile/company_" + "{}.{}".format(instance.account.username, extension)


class Company(models.Model):
    account = models.ForeignKey(Account, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    website = models.TextField(null=True)
    description = models.TextField(null=True)
    profile_picture = models.ImageField(null=True)

    followers = models.ManyToManyField(Student)
    specialties = models.ManyToManyField(Specialty)
