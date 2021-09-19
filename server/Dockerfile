FROM python:latest
WORKDIR /app

COPY ./Pipfile .

RUN pip3 install pipenv && \
    pipenv install

COPY . .

EXPOSE 5000

CMD ["pipenv", "run", "python", "main.py"]