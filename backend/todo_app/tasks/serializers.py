from rest_framework import serializers
from .models import Task


# Making a simple API endpoint of our model
class TaskSerializer(serializers.ModelSerializer):
    
    # Using built in Meta class
    class Meta:
        model = Task
        fields = "__all__"


