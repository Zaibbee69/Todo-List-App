from django.db import models

# Create your models here.


# Setting the standard for priority levels for tasks
PRIORITY = [
    ("low", "Low"),
    ("medium", "Medium"),
    ("high", "High")
]


# Model for tasks that user saves in db
class Task(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    is_completed = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    priority = models.CharField(max_length=10, choices=PRIORITY, default="medium")
    due_date = models.DateField(null=True, blank=True)

    # Defining the Model
    def __str__(self):
        return self.title