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
        vx:0,
        vy:0
    }
})
playertwo.draw()
console.log(playertwo)


function animateFrames() {
    console.log('test')
    window.requestAnimationFrame(animateFrames)
}
animateFrames()

window.addEventListener("keydown", function(p){
    console.log(p.code)
})