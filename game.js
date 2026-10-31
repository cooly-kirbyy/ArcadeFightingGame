const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext("2d")

class sprite {
    constructor(position) {
        this.position = position
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, 75, 200)
    }
}

const playerone = new sprite({
    x:0,
    y:0
})

playerone.draw()

console.log(playerone)