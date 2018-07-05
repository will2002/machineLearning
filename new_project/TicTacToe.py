import sys
import os

def drawBoard():
    os.system('cls' if os.name == 'nt' else 'clear')
    print("  |   |  ")
    print("---------")
    print("  |   |  ")
    print("---------")
    print("  |   |  ")

def askInput():
    if firsttime == 1:
        print("1 is top left, 2 is top middle, etc.")
        firsttime == 0
    tile = input("What tile would you like to play in? (numkey 1-9): ")


def main():
    global firsttime
    firsttime = 1
    drawBoard()
    askInput()

if __name__ == "__main__":
    main()