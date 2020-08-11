from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework import status, serializers
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from drf_yasg.utils import swagger_auto_schema

from app.models.job import Job
from app.models.post import Post
from app.models.company import Company
from app.models.student import Student
from app.models.skill import Skill
from app.models.city import City
from app.models.specialty import Specialty
from app.services.feed import get_feed, suggest_job, suggest_follow


class SkillRelatedField(serializers.RelatedField):
    def display_value(self, instance):
        return instance

    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return Skill.objects.get(name=data)

class CityRelatedField(serializers.RelatedField):
    def display_value(self, instance):
        return instance

    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return City.objects.get(name=data)

class StudentRelatedField(serializers.RelatedField):
    def display_value(self, instance):
        return instance

    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return Student.objects.get(account_id=data)

class SpecialtyRelatedField(serializers.RelatedField):
    def display_value(self, instance):
        return instance

    def to_representation(self, value):
        return str(value)

    def to_internal_value(self, data):
        return Specialty.objects.get(name=data)


class PostSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    student_firstname = serializers.SerializerMethodField()
    student_lastname = serializers.SerializerMethodField()
    student_profile_picture = serializers.SerializerMethodField()
    interested_students = StudentRelatedField(queryset=Student.objects.all(), many=True)
    skills = SkillRelatedField(queryset=Skill.objects.all(), many=True)

    def get_student_firstname(self, obj):
        return obj.student.firstname

    def get_student_lastname(self, obj):
        return obj.student.lastname

    def get_student_profile_picture(self, obj):
        return obj.student.profile_picture

    def get_type(self, obj):
        return 'post'

    class Meta:
        model = Post
        ref_name = 'PostSerializer'
        fields = ['type', 'id', 'student_firstname', 'student_lastname', 'student_profile_picture',
                  'title', 'content', 'published_date', 'interested_students', 'skills']

class JobSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    company_name = serializers.SerializerMethodField()
    company_profile_picture = serializers.SerializerMethodField()
    cities = CityRelatedField(queryset=City.objects.all(), many=True)
    skills = SkillRelatedField(queryset=Skill.objects.all(), many=True)

    def get_company_name(self, obj):
        return obj.company.name

    def get_company_profile_picture(self, obj):
        return obj.company.profile_picture

    def get_type(self, obj):
        return 'job'

    class Meta:
        model = Job
        ref_name = 'JobSerializer'
        fields = ['id', 'company_name', 'company_profile_picture', 'title', 'description',
                  'seniority_level', 'employment_type', 'recruitment_url', 'published_date',
                  'cities', 'skills']

class FeedGetView(APIView):
    class InputSerializer(serializers.Serializer):
        page = serializers.IntegerField(required=True)

        class Meta:
            ref_name = 'FeedGetIn'
            fields = ['p']

    class OutputSerializer(serializers.Serializer):
        @classmethod
        def get_serializer(cls, model):
            if model == Post:
                return PostSerializer
            elif model == Job:
                return JobSerializer

        def to_representation(self, instance):
            serializer = self.get_serializer(instance.__class__)
            return serializer(instance, context=self.context).data

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(query_serializer=InputSerializer, responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        serializer = self.InputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        result = get_feed(account=request.user, **serializer.validated_data)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)



class FeedSuggestJobView(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        company_name = serializers.SerializerMethodField()
        company_profile_picture = serializers.SerializerMethodField()
        cities = CityRelatedField(queryset=City.objects.all(), many=True)

        def get_company_name(self, obj):
            return obj.company.name

        def get_company_profile_picture(self, obj):
            return obj.company.profile_picture

        class Meta:
            model = Job
            ref_name = 'FeedSuggestJobOut'
            fields = ['id', 'company_name', 'company_profile_picture', 'title',
                      'recruitment_url', 'cities']

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        result = suggest_job(account=request.user)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)


class FeedSuggestFollowView(APIView):
    class OutputSerializer(serializers.ModelSerializer):
        id = serializers.SerializerMethodField()
        specialties = SpecialtyRelatedField(queryset=Specialty.objects.all(), many=True)

        def get_id(self, obj):
            return obj.account.id

        class Meta:
            model = Company
            ref_name = 'FeedSuggestFollowOut'
            fields = ['id', 'name', 'profile_picture', 'specialties']

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        result = suggest_follow(account=request.user)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)