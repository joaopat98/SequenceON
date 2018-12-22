web: sh -c 'cd sequenceon && daphne sequenceon.asgi:application --port $port --bind 0.0.0.0'
worker: sh -c 'cd sequenceon && python manage.py runworker channels -v2'