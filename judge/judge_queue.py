import os
import redis
import psycopg2
import sandbox
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

def resolve_submissions(count=0):
    conn = psycopg2.connect(
        dbname=DB_NAME,
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    cursor = conn.cursor()
    cursor.execute('SELECT s.id, s."problemId", s."solutionPath", p."timeLimit", p."memoryLimit" FROM \"Submission\" s JOIN "Problem" p ON s."problemId" = p.id where status=\'WAITING\';')
    submissions = cursor.fetchall()
    for submission in submissions:
        submissionId = submission[0]
        problemId = submission[1]
        solutionPath = submission[2]
        timeLimit = submission[3]
        memoryLimit = submission[4]

        cursor.execute('SELECT "inputFilePath", "outputFilePath" FROM \"ProblemTestCase\" where "problemId"=%s order by "createdAt";', (problemId,))
        testCases = cursor.fetchall()

        os.system(f'cp {solutionPath} .')
        solution_name = os.path.basename(solutionPath)

        res = sandbox.compile_code(solution_name)

        print(res)

        for i, testCase in enumerate(testCases):
            inputPath = testCase[0]
            outputPath = testCase[1]

        os.system(f'rm {solution_name}')
        
        print(solutionPath)


    cursor.close()
    conn.close()

    if count == 0:
        resolve_submissions(count+1)

def ping_listener():
    print("Listening for pings...")
    for message in pubsub.listen():
        if message['type'] == 'message':
            resolve_submissions()

if __name__ == "__main__":
    resolve_submissions()
    ping_listener()
