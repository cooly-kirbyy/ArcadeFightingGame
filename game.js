const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext("2d")

class sprite {
    constructor(position) {
        this.position = position
    }

    draw() {
        ctext.fillRect(this.position.x,this.position.y,width = 100, height = 300)
    }
}

const playerone = new sprite({
    x:0,
    y:0
})

console.log(playerone)