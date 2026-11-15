from django.shortcuts import render

from projects.models import Project
from contact.forms import ContactMessageForm


def home(request):
    projects = (
        Project.objects
        .filter(featured=True)
        .prefetch_related("technologies")
        .order_by("display_order", "-created_at")[:2]
    )

    context = {
        "projects": projects,
        "form": ContactMessageForm(),
    }

    return render(request, "core/home.html", context)
