from django.http import HttpResponse


def index(request):
    return HttpResponse('<h1 style="text-align: center">Welcome API World!!</h1>')
