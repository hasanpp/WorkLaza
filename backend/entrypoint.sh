#!/bin/sh
echo "Running migrations..."
python manage.py migrate

echo "Starting Django..."
exec "$@"
