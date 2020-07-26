from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, serializers
from drf_yasg.utils import swagger_auto_schema

from app.services.experience import list_experience, create_experience, update_experience, delete_experience


class ExperienceListView(APIView):
    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=True)

        class Meta:
            ref_name = 'ExperienceListIn'
            fields = ['id']

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        company_name = serializers.CharField()
        profile_picture = serializers.ImageField()
        start_date = serializers.DateField()
        end_date = serializers.DateField()
        title = serializers.CharField()
        description = serializers.CharField()

        class Meta:
            ref_name = 'ExperienceListOut'
            fields = ['id', 'company_name', 'profile_picture', 'start_date', 'end_date', 'title', 'description']

    permission_classes = [AllowAny]
    authentication_classes = []

    @swagger_auto_schema(query_serializer=InputSerializer, responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        serializer = self.InputSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        result = list_experience(**serializer.validated_data)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)


class ExperienceCreateView(APIView):
    class InputSerializer(serializers.Serializer):
        company_name = serializers.CharField(required=True)
        start_date = serializers.DateField(required=True)
        end_date = serializers.DateField(required=True)  # Does this really required? idk
        major = serializers.CharField(required=True)
        degree = serializers.CharField(required=True)

        class Meta:
            ref_name = 'ExperienceCreateIn'
            fields = ['company_name', 'start_date', 'end_date', 'major', 'degree']

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        company_name = serializers.CharField()
        profile_picture = serializers.ImageField()
        start_date = serializers.DateField()
        end_date = serializers.DateField()
        title = serializers.CharField()
        description = serializers.CharField()

        class Meta:
            ref_name = 'ExperienceCreateOut'
            fields = ['id', 'company_name', 'profile_picture', 'start_date', 'end_date', 'title', 'description']

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=InputSerializer, responses={201: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def post(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = create_experience(account=request.user, **serializer.validated_data)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_201_CREATED)


class ExperienceUpdateView(APIView):
    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=True)
        school_name = serializers.CharField(required=True)
        start_date = serializers.DateField(required=True)
        end_date = serializers.DateField(required=True)  # Does this really required? idk
        major = serializers.CharField(required=True)
        degree = serializers.CharField(required=True)

        class Meta:
            ref_name = 'ExperienceUpdateIn'
            fields = ['id', 'school_name', 'start_date', 'end_date', 'major', 'degree']

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        company_name = serializers.CharField()
        profile_picture = serializers.ImageField()
        start_date = serializers.DateField()
        end_date = serializers.DateField()
        title = serializers.CharField()
        description = serializers.CharField()

        class Meta:
            ref_name = 'ExperienceUpdateOut'
            ['id', 'company_name', 'profile_picture', 'start_date', 'end_date', 'title', 'description']

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=InputSerializer, responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def put(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = update_experience(account=request.user, **serializer.validated_data)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)


class ExperienceDeleteView(APIView):
    class InputSerializer(serializers.Serializer):
        id = serializers.IntegerField(required=True)

        class Meta:
            ref_name = 'ExperienceDeleteIn'
            fields = ['id']

    class OutputSerializer(serializers.Serializer):
        id = serializers.IntegerField()
        company_name = serializers.CharField()
        profile_picture = serializers.ImageField()
        start_date = serializers.DateField()
        end_date = serializers.DateField()
        title = serializers.CharField()
        description = serializers.CharField()

        class Meta:
            ref_name = 'ExperienceDeleteOut'
            ['id', 'company_name', 'profile_picture', 'start_date', 'end_date', 'title', 'description']

    permission_classes = [IsAuthenticated]

    @swagger_auto_schema(request_body=InputSerializer, responses={200: OutputSerializer(many=True)})
    @method_decorator(ensure_csrf_cookie)
    def delete(self, request):
        serializer = self.InputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        result = delete_experience(account=request.user, **serializer.validated_data)
        return Response(self.OutputSerializer(result, many=True).data, status=status.HTTP_200_OK)
