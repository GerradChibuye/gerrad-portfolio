from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import include, path

from core import views
from core.seo import sitemap, robots_txt


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", views.home, name="home"),
    path("sitemap.xml", sitemap, name="sitemap"),
    path("robots.txt", robots_txt, name="robots_txt"),
    path("projects/", include("projects.urls")),
    path("contact/", include("contact.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
