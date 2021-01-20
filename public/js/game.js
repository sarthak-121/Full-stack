const canvas = document.getElementById('gameboard')
const ctx = canvas.getContext('2d')

class Body {
    constructor(x, y, height, width) {
        this.x = x,
        this.y = y,
        this.height = height,
        this.width = width
    }

    update() {

    }

    draw(ctx) {
        ctx.fillRect(this.x, this.y, this.height, this.width)
    }
}

class Input {
    constructor(box) {
        
        this.box = box
        this.input = undefined

        document.addEventListener("keydown", event => {
            switch (event.keyCode) {
              case 37:
                car.moveLeft();
                break;
              case 39:
                car.moveRight();
                break;
              case 27:
                this.gameMode = 1;
                break;
              case 32:
                this.gameMode = 0;
                break;
            }
        })
    }
}


const box1 = new Body(10, 10, 50, 50)
const box2 = new Body(450, 450, 50, 50)
const box = [box1, box2]
const input = new Input(box)

function gameLoop() {
    box1.draw(ctx)

    setTimeout(gameLoop, 33)
}

setTimeout(gameLoop, 33)