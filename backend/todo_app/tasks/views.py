from django.shortcuts import render
from .models import Task
from rest_framework import viewsets
from .serializers import TaskSerializer

# Create your views here.


# Making a simple API endpoint for Tasks viewpoint
class TaskViewSet(viewsets.ModelViewSet):

    # Filtering the db for all tasks and ordering by date created
    queryset = Task.objects.all().order_by("-created_at")

    # Setting the serializer class for our endpoint
    serializer_class = TaskSerializer
