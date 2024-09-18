import os
import subprocess
import sys

def run_test_case(executable_path, input_path, checker_path):
    assert os.path.isfile(executable_path)
    assert os.path.isfile(input_path)
    assert os.path.isfile(checker_path)

    executable_name = os.path.basename(executable_path)
    input_name = os.path.basename(input_path)
    checker_name = os.path.basename(checker_path)
    
    try:
        # Initialize the isolate sandbox
        result = subprocess.run(['isolate', '--init'], check=True, capture_output=True, text=True)
        box = f'{result.stdout.strip()}/box'

        os.system(f'cp {executable_path} {box}')
        os.system(f'cp {input_path} {box}')
        os.system(f'cp {checker_path} {box}')

        result = subprocess.run(
            ['isolate', '--mem=216000', '--processes=1', '--time', '1', '--run', '--',
            f'./{executable_name}'],
            input=open(input_path, 'r').read(),
            capture_output=True, text=True
        )


        with open('output.txt', 'w') as output_file:
            output_file.write(result.stdout)
    
    except subprocess.CalledProcessError as e:
        print(f"Error during process execution: {e}")
        return "", e.stderr
    
    finally:
        # Cleanup the sandbox
        subprocess.run(['isolate', '--cleanup'], check=True)

    checker_result = subprocess.run(['python3', checker_name, input_name, 'output.txt'], check=True, capture_output=True, text=True)
    accepted = 'Accepted' in checker_result.stdout

    if not accepted and result.returncode != 0:
        if result.stderr.strip() == 'Time limit exceeded':
            print('Time limit')
            exit(0)
        else:
            print('Runtime Error')
            exit(0)

    return result.stdout, result.stderr

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python script.py <path_to_executable>")
        sys.exit(1)

    executable_path = sys.argv[1]
    stdout, stderr = run_test_case(executable_path, 'input1.txt', 'eval.py')
    print("Standard Output:")
    print(stdout)
    print("Standard Error:")
    print(stderr)
