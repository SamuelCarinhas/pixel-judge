import os
import subprocess
import sys

compile_command = {
    'py': None,
    'cpp': 'g++ -std=gnu++17 -O2',
    'c': 'gcc -std=gnu17 -O2',
    'java': 'javac -encoding utf-8'
}

def compile_code(code_path):
    assert os.path.isfile(code_path)

    file_extension = code_path.split('.')[-1].lower()

    if not compile_command[file_extension]:
        return {
            'executable': code_path,
            'error': ''
        }
    
    args = compile_command[file_extension].split()
    args.append(code_path)


    try:
        result = subprocess.run(args, check=True, capture_output=True, text=True, timeout=5)
        return {
            'executable': 'a.out',
            'error': result.stderr
        }
    except subprocess.TimeoutExpired:
        return {
            'executable': None,
            'error': 'Compilation timed out'
        }
    except subprocess.CalledProcessError as e:
        return {
            'executable': None,
            'error': e.stderr
        }

def execute_command(command):
    ext = command.split('.')[-1]
    if ext == 'py':
        return [f'/usr/bin/python3', f'{command}']
    elif ext == 'java':
        return [f'/usr/bin/java', f'{command}']
    else:
        return [f'./{command}']

def run_test_case(executable_path, input_path, output_path, checker_path, time_limit, memory_limit):
    assert os.path.isfile(executable_path)
    assert os.path.isfile(input_path)
    assert os.path.isfile(output_path)
    assert os.path.isfile(checker_path)

    executable_name = os.path.basename(executable_path)
    input_name = os.path.basename(input_path)
    output_name = os.path.basename(output_path)
    checker_name = os.path.basename(checker_path)
    
    try:
        # Initialize the isolate sandbox
        result = subprocess.run(['isolate', '--init'], check=True, capture_output=True, text=True)
        box = f'{result.stdout.strip()}/box'

        os.system(f'cp {executable_path} {box}')
        os.system(f'cp {input_path} {box}')
        os.system(f'cp {checker_path} {box}')

        cmds = ['isolate', f'--mem={memory_limit}', '--processes=1', '--time', f'{time_limit}', '--run', '--',
            *execute_command(executable_name)]
        result = subprocess.run(
            cmds,
            input=open(input_path, 'r').read(),
            capture_output=True, text=True
        )

        with open('output.txt', 'w') as output_file:
            output_file.write(result.stdout)
    
    except subprocess.CalledProcessError as e:
        return {
            'response': 'System Error',
            'out': result.stdout,
            'log': e
        }
    
    finally:
        # Cleanup the sandbox
        subprocess.run(['isolate', '--cleanup'], check=True)

    checker_result = subprocess.run(['python3', checker_name, input_path, output_path, 'output.txt'], check=True, capture_output=True, text=True)
    accepted = 'Accepted' in checker_result.stdout

    if not accepted and result.returncode != 0:
        if result.stderr.strip() == 'Time limit exceeded':
            return {
                'response': 'Time Limit Exceeded',
                'out': result.stdout,
                'log': ''
            }
        else:
            return {
                'response': 'Runtime Error',
                'out': result.stdout,
                'log': result.stderr
            }
    
    return {
        'response': 'Accepted' if accepted else 'Wrong Answer',
        'out': result.stdout,
        'log': ''
    }

    return result.stdout, result.stderr