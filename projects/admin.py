from django.contrib import admin
from .models import Project, Technology


@admin.register(Technology)
class TechnologyAdmin(admin.ModelAdmin):
    list_display = ("name", "slug")
    search_fields = ("name",)
    prepopulated_fields = {"slug": ("name",)}


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "category",
        "status",
        "featured",
        "display_order",
        "created_at",
    )

    list_filter = (
        "category",
        "status",
        "featured",
    )

    search_fields = (
        "title",
        "summary",
        "description",
    )

    prepopulated_fields = {"slug": ("title",)}

    filter_horizontal = ("technologies",)

    readonly_fields = ("created_at", "updated_at")

    ordering = ("display_order", "-created_at")
