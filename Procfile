release: sh -c 'cd sequenceon && python manage.py migrate'
web: sh -c 'cd sequenceon && daphne sequenceon.asgi:application --port $PORT --bind 0.0.0.0 -v2'
worker: sh -c 'cd sequenceon && python manage.py runworker channels -v2'