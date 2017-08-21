from django.conf.urls import url, include

urlpatterns = [
    url(r'^role-manager/', include('drf_role.urls')),
]
