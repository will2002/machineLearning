import sys
import math

def pythagorean(a, b):
    return math.sqrt(math.pow(a, 2) + math.pow(b, 2))
def repeat(iterations, value):
    i = 0
    while i < int(iterations):
        print(value)
        i += 1

def power(base, exponent):
    print(math.pow(int(base), int(exponent)))

def main():
    if sys.argv[1] == "countto":
        list = [0]
        for i in range(int(sys.argv[2])):
            list.append(i + 1)
        print(list)
    if sys.argv[1] == "pythag":
        print(pythagorean(float(sys.argv[2]), float(sys.argv[2])))

    if sys.argv[1] == "repeat":
        repeat(sys.argv[2], sys.argv[3])
    if sys.argv[1] == "pow":
        power(sys.argv[2], sys.argv[3])
if __name__ == "__main__":
    main()