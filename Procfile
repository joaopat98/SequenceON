release: sh -c 'cd sequenceon && python manage.py migrate'
web: sh -c 'cd sequenceon && gunicorn sequenceon.asgi:application -w 4 -k uvicorn.workers.UvicornWorker'