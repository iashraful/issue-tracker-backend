from django.conf.urls import url, include

urlpatterns = [
    url(r'^api/v1/role-manager/', include('drf_role.urls')),
]
