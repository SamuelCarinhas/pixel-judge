import os
import redis
from dotenv import load_dotenv, find_dotenv
from celery import Celery

load_dotenv(find_dotenv())

REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

app = Celery('tasks', broker=f'redis://:{REDIS_PASSWORD}@localhost:6379/0')

redis_client = redis.Redis(host='localhost', port=6379, password=REDIS_PASSWORD)

@app.task
def ping_queue():
    redis_client.publish('ping', 'queue pinged')
    return "Queue Pinged"
