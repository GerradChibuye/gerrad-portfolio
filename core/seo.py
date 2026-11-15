from django.http import HttpResponse
from django.shortcuts import render
from django.urls import reverse

from projects.models import Project


def sitemap(request):
    urls = [
        request.build_absolute_uri(reverse("home")),
        request.build_absolute_uri(reverse("projects:list")),
    ]

    for project in Project.objects.all():
        urls.append(
            request.build_absolute_uri(
                reverse("projects:detail", kwargs={"slug": project.slug})
            )
        )

    return render(
        request,
        "sitemap.xml",
        {"urls": urls},
        content_type="application/xml",
    )


def robots_txt(request):
    sitemap_url = request.build_absolute_uri(reverse("sitemap"))

    content = (
        "User-agent: *\n"
        "Allow: /\n"
        "Disallow: /admin/\n\n"
        f"Sitemap: {sitemap_url}\n"
    )

    return HttpResponse(content, content_type="text/plain")
