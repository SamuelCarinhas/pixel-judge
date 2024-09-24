import os
import subprocess
import sys

def compile_code(code_path, compile_flag, compile_command):
    assert os.path.isfile(code_path)
    if not compile_flag:
        return {
            'executable': code_path,
            'error': ''
        }

    args = compile_command.replace('$', code_path).split()

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

def run_test_case(executable_path, run_command, input_path, output_path, checker_path, time_limit, memory_limit):
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

        print(time_limit)

        execute_command = run_command.replace('$', executable_path).split()

        cmds = ['isolate', f'--mem={memory_limit}', '--processes=1', f'--time={time_limit}', f'--wall-time={time_limit+1}', f'--extra-time={time_limit+0.5}', '--run', '--',
            *execute_command]
        
        print(' '.join(cmds))
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

    if not accepted and result.returncode != 0 or result.stderr.strip() == 'Time limit exceeded' or result.stderr.strip() == 'Time limit exceeded (wall clock)':
        if result.stderr.strip() == 'Time limit exceeded' or result.stderr.strip() == 'Time limit exceeded (wall clock)':
            return {
                'response': 'Time Limit Exceeded',
                'time': time_limit,
                'out': result.stdout,
                'log': ''
            }
        else:
            return {
                'response': 'Runtime Error',
                'out': result.stdout,
                'log': result.stderr
            }
    
    time = float(result.stderr.strip().split(' sec real')[-2].split('(')[-1])
    
    return {
        'response': 'Accepted' if accepted else 'Wrong Answer',
        'time': time,
        'out': result.stdout,
        'log': ''
    }

    return result.stdout, result.stderr
