FROM python:3.13.0-slim

ENV PYTHONDONTWRITEBYECODE=1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt /app/


RUN apt-get update \
 && apt-get install -y --force-yes \
 curl nano python3-pip gettext chrpath libssl-dev libxft-dev \
 libfreetype6 libfreetype6-dev  libfontconfig1 libfontconfig1-dev \
  && rm -rf /var/lib/apt/lists/*
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

COPY . /app/ 


EXPOSE 8000

RUN mkdir -p /app/staticfiles /app/media


CMD [ "daphne", "-b", "0.0.0.0", "manage.py", "runserver", "-p", "8000", "petsphere.asgi:application" ]



