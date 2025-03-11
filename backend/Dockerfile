# Use the official Python runtime image
FROM python:3.13.0-slim

# Set environment variables 
# Prevents Python from writing pyc files to disk
ENV PYTHONDONTWRITEBYECODE=1
#Prevents Python from buffering stdout and stderr
ENV PYTHONUNBUFFERED 1

# Set the working directory inside the container
WORKDIR /app

# Upgrade pip
RUN pip install --upgrade pip 

# Copy the Django project  and install dependencies
COPY requirements.txt /app/

# run this command to install all dependencies 
RUN pip install --no-cache-dir -r requirements.txt

# Copy the Django project to the container
COPY . /app/
 
# Expose the Django port
EXPOSE 8000

# Run Django’s development server
CMD ["gunicorn","daphne", "-b", "0.0.0.0", "-p", "8000", "backend.asgi:application"]




