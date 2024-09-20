import sys

try:
    input_file = sys.argv[1]
    output_file = sys.argv[2]
    compare_file = sys.argv[3]

    output_lines = []
    with open(output_file, 'r') as f:
        output_lines = [line.strip() for line in f.readlines() if len(line.strip()) > 0]

    compare_lines = []
    with open(compare_file, 'r') as f:
        compare_lines = [line.strip() for line in f.readlines() if len(line.strip()) > 0]

    assert output_lines == compare_lines
    print('Accepted')
except:
    print('Wrong Answer')