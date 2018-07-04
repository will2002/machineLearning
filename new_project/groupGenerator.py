import sys
import math
import random

def main():
    groupSize = int(sys.argv[1])
    people = []
    for i in range(len(sys.argv) - 2):
        people.append(str(sys.argv[i + 2]))
    for i in range(math.floor(len(people) / groupSize)):
        print("Group " + str(i + 1) + ":")
        print(people.pop(random.randrange(len(people)))
        print(people.pop(random.randrange(len(people)))





if __name__ == "__main__":
    main()