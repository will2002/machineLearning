import sys
import random

def main():
    chars = ["F", "H", "F", "F"]
    rows = int(sys.argv[1])
    columns = int(sys.argv[2])
    maze = []
    for i in range(rows):
        column = []
        for j in range(columns):
            column.append(chars[random.randrange(4)])
        maze.append(column)
    maze[0][0] = "S"
    maze[rows - 1][columns - 1] = "E"

    for i in range(rows):
        line = ""
        for j in range(columns):
            line = line + maze[i][j]
            line = line + " "
        print(line)

if __name__ == "__main__":
    main()