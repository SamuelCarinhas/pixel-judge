import os
import redis
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")

redis_client = redis.Redis(host='localhost', port=6379, password=REDIS_PASSWORD)
pubsub = redis_client.pubsub()

pubsub.subscribe('ping')

def ping_listener():
    print("Listening for pings...")
    for message in pubsub.listen():
        if message['type'] == 'message':
            # TODO: GET WAITING SUBMISSIONS
            # TODO: EVALUATE SUBMISSIONS
            # TODO: UPDATE SUBMISSIONS
            pass

if __name__ == "__main__":
    ping_listener()
