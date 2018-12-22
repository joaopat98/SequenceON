from django.http import HttpResponse


class HttpResponseUnauthorized(HttpResponse):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.status_code = 401
