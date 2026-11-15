from django.contrib import messages
from django.shortcuts import redirect, render

from projects.models import Project
from .forms import ContactMessageForm


def submit_contact(request):
    if request.method != "POST":
        return redirect("home")

    form = ContactMessageForm(request.POST)

    if form.is_valid():
        # Silently discard submissions caught by the honeypot.
        if form.cleaned_data.get("website"):
            messages.success(
                request,
                "Thank you. Your message has been received."
            )
            return redirect("/#contact")

        form.save()

        messages.success(
            request,
            "Thank you for getting in touch. Your message has been received."
        )

        return redirect("/#contact")

    projects = (
        Project.objects
        .prefetch_related("technologies")
        .order_by("display_order", "-created_at")
    )

    return render(
        request,
        "core/home.html",
        {
            "projects": projects,
            "form": form,
        },
    )
