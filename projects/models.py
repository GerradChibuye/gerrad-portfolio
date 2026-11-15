from django.db import models
from django.utils.text import slugify


class Technology(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=120, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "Technologies"

    def __str__(self):
        return self.name


class Project(models.Model):

    class Category(models.TextChoices):
        INFRASTRUCTURE = "infrastructure", "Infrastructure"
        SOFTWARE = "software", "Software Development"
        NETWORKING = "networking", "Networking"
        COMMUNITY = "community", "Community"

    class Status(models.TextChoices):
        COMPLETED = "completed", "Completed"
        IN_PROGRESS = "in_progress", "In Progress"

    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=220, unique=True)

    summary = models.CharField(max_length=300)
    description = models.TextField()

    category = models.CharField(
        max_length=30,
        choices=Category.choices,
    )

    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.COMPLETED,
    )

    technologies = models.ManyToManyField(
        Technology,
        related_name="projects",
        blank=True,
    )

    cover_image = models.ImageField(
        upload_to="projects/",
        blank=True,
    )

    video_preview = models.FileField(
        upload_to="projects/videos/",
        blank=True,
    )

    github_url = models.URLField(blank=True)
    live_url = models.URLField(blank=True)

    featured = models.BooleanField(default=False)
    display_order = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["display_order", "-created_at"]

    def __str__(self):
        return self.title
