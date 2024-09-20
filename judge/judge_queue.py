import os
import redis
import psycopg2
from dotenv import load_dotenv, find_dotenv

load_dotenv(find_dotenv())

REDIS_PASSWORD = os.environ.get("REDIS_PASSWORD")
DB_NAME = os.environ.get("DB_NAME")
DB_PASSWORD = os.environ.get("DB_PASSWORD")
DB_USER = os.environ.get("DB_USER")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT = os.environ.get("DB_PORT")

redis_client = redis.Redis(host='localhost', port=6379, password=REDIS_PASSWORD)
pubsub = redis_client.pubsub()

pubsub.subscribe('ping')

def resolve_submissions():
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM \"Submission\" where status=\'WAITING\';')  # Adjust according to your schema
    submissions = cursor.fetchall()
    print("Fetched submissions:", submissions)
    cursor.close()
    conn.close()

def ping_listener():
    print("Listening for pings...")
    for message in pubsub.listen():
        if message['type'] == 'message':
            resolve_submissions()

if __name__ == "__main__":
    resolve_submissions()
    ping_listener()
