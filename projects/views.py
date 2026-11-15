from django.shortcuts import get_object_or_404, render

from .models import Project


def project_list(request):
    projects = (
        Project.objects
        .prefetch_related("technologies")
        .order_by("display_order", "-created_at")
    )

    return render(
        request,
        "projects/project_list.html",
        {"projects": projects},
    )


def project_detail(request, slug):
    project = get_object_or_404(
        Project.objects.prefetch_related("technologies"),
        slug=slug,
    )

    return render(
        request,
        "projects/project_detail.html",
        {"project": project},
    )
