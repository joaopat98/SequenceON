release: sh -c 'cd sequenceon && python manage.py migrate'
web: sh -c 'cd sequenceon && gunicorn sequenceon.wsgi:application'
worker: sh -c 'cd sequenceon && gunicorn -w 4 -k uvicorn.workers.UvicornWorker'