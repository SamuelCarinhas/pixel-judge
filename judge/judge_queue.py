import os
import redis
import psycopg2
import sandbox
import json
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
    cursor.execute('''
        SELECT s.id, s."problemId", s."solutionPath", p."timeLimit", p."memoryLimit",
            l."fileExtension", l."compile", l."compileCommand", l."runCommand"
        FROM "Submission" s
        JOIN "Problem" p ON s."problemId" = p.id
        JOIN "Language" l ON s."languageId" = l.id
        WHERE s."status" = \'WAITING\';
    ''')
    submissions = cursor.fetchall()
    for submission in submissions:
        submissionId = submission[0]
        cursor.execute('UPDATE \"Submission\" SET status=\'JUDGING\' WHERE id=%s', (submissionId,))
        conn.commit()
        problemId = submission[1]
        solutionPath = submission[2]
        timeLimit = submission[3]
        memoryLimit = submission[4] * 1000
        fileExtension = submission[5]
        compileFlag = submission[6]
        compileCommand = submission[7]
        runCommand = submission[8]

        print(f'Evaluating submission {submissionId}')

        cursor.execute('SELECT "inputFilePath", "outputFilePath" FROM \"ProblemTestCase\" where "problemId"=%s order by "createdAt";', (problemId,))
        testCases = cursor.fetchall()

        os.system(f'cp {solutionPath} .')
        solution_name = os.path.basename(solutionPath)

        res = sandbox.compile_code(solution_name, compileFlag, compileCommand)

        if res['error']:
            cursor.execute('UPDATE \"Submission\" SET status=\'FINISHED\', verdict=%s, details=%s WHERE id=%s', ('Compilation Error', res['error'], submissionId))
            conn.commit()
            print('Compilation Error')
            continue
        
        executable = res['executable']
        verdict = None
        for i, testCase in enumerate(testCases):
            print(f'Running test case {i+1}')
            cursor.execute('UPDATE \"Submission\" SET verdict=%s WHERE id=%s', (f'Running test case {i+1}', submissionId))
            conn.commit()
            message = {
                'submissionId': submissionId,
                'verdict': f'Running test case {i+1}'
            }
            redis_client.publish('submission_status', json.dumps(message))
            inputPath = testCase[0]
            outputPath = testCase[1]
            res = sandbox.run_test_case(executable, runCommand, inputPath, outputPath, 'default_evaluator.py', timeLimit, memoryLimit)
            verdict = res
            if res['response'] != 'Accepted':
                break
        if verdict is None:
            cursor.execute('UPDATE \"Submission\" SET status=\'FINISHED\', verdict=%s, details=%s WHERE id=%s', ('Invalid Problem', 'No test cases', submissionId))
            conn.commit()
            continue
        exec_time = 0
        if 'time' in verdict:
            exec_time = verdict['time']
        cursor.execute('UPDATE \"Submission\" SET status=\'FINISHED\', verdict=%s, details=%s, "execTime"=%s WHERE id=%s', (verdict['response'], verdict['log'], exec_time, submissionId))
        conn.commit()
        message = {
            'submissionId': submissionId,
            'execTime': exec_time,
            'verdict': verdict['response']
        }
        redis_client.publish('submission_status', json.dumps(message))
        message = {
            'submissionId': submissionId,
            'result': verdict['response']
        }
        redis_client.publish('submission_result', json.dumps(message))
        print('Verdict:', verdict)
        os.system(f'rm {solution_name}')
        if solution_name != executable:
            os.system(f'rm {executable}')
        os.system(f'rm output.txt')


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
