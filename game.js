const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext("2d")

class sprite {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, 75, 200)
    }

    update() {
    this.draw()
    this.position.x += this.velocity.vx
}
}

const playerone = new sprite({
    position:{
        x:0,
        y:0
    },
    velocity:{
        vx:0,
        vy:0,
    }
})
playerone.draw()
console.log(playerone)


const playertwo = new sprite({
    position:{
        x:800,
        y:0
    },
    velocity:{
        x:0,
        y:0
    }
})
playertwo.draw()
console.log(playertwo)

function animateFrames() {
    console.log('test')
    playerone.update()
    window.requestAnimationFrame(animateFrames)
}
animateFrames()

window.addEventListener("keydown", function(p){
    if (p.code === "KeyD") {
        playerone.velocity.vx = 1
        console.log('D key was pressed')
    }
    else if (p.code === "KeyA") {
        console.log('A key was pressed')
    }
    else if (p.code === "KeyW") {
        console.log('W key was pressed')
    }
    else if (p.code === "KeyS") {
        console.log('S key was pressed')
    }

})