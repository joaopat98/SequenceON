from .responses import HttpResponseUnauthorized


def require_login(func):
    def func_wrapper(request, **kwargs):
        if request.user.is_authenticated:
            return func(request, **kwargs)
        else:
            return HttpResponseUnauthorized()

    return func_wrapper
