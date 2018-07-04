import sys

def main():
    i = 1
    userimput = []
    while i < len(sys.argv):
        userimput.append(sys.argv[i])
        i += 1

    print(userimput)

if __name__ == "__main__":
    main()