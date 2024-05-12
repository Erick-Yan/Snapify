FROM python:3.12.3

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Set the working directory in the container
WORKDIR /app

# Copy the Poetry files and requirements.txt to the working directory
COPY pyproject.toml poetry.lock requirements.txt ./

# Install Poetry
RUN python -m venv venv && \
    curl -sSL https://install.python-poetry.org | POETRY_HOME=/usr/local/poetry python3 -

# Add Poetry to the system PATH
ENV PATH="/usr/local/poetry/bin:${PATH}"

# Set Python version for Poetry
RUN poetry env use $(which python)

# Install dependencies using Poetry
RUN poetry install --no-root

# Activate virtual environment
RUN . venv/bin/activate && \
    pip install --no-cache-dir flask-sqlalchemy

# Copy the rest of the application code to the working directory
COPY . .

# Expose port 5000 to the outside world
EXPOSE 5000

# Command to run the Flask application
CMD ["poetry", "run", "flask", "run", "--host=0.0.0.0"]
