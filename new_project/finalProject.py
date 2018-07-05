import turtle
import time


def main():
    global screen
    screen = turtle.Screen()
    turtle.speed(0)
    turtle.hideturtle()
    drawTerrain()



def drawTerrain():
    while True:
        turtle.tracer(0)
        turtle.clearscreen()
        turtle.penup()
        turtle.goto(-400, 0)
        turtle.pendown()
        turtle.goto(400, 0)
        time.sleep(0.1)
        turtle.update()


if __name__ == "__main__":
    main()