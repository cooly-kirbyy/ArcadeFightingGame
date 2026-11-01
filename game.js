const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext('2d')
const grav = 0.4

class sprite {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.height = 200
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, 75, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vyu
        this.position.y += this.velocity.vyd

        if (this.position.y + this.height + this.velocity.vyd >= canvas.height) {
            this.velocity.vyd = 0 
        } else this.velocity.vyd += grav
        
    }   
}

class spritetwo {
    constructor({position, velocity}) {
        this.position = position
        this.velocity = velocity
        this.height = 200
    }

    draw() {
        ctext.fillStyle = 'black'
        ctext.fillRect(this.position.x,this.position.y, 75, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vyu
        this.position.y += this.velocity.vyd

        if (this.position.y + this.height + this.velocity.vyd >= canvas.height) {
            this.velocity.vyd = 0
        } else this.velocity.vyd += grav

    }   
}

const playerone = new sprite({
    
    position:{
        x:0,
        y:0
    },
    velocity:{
        vxl:0,
        vxr:0,
        vyd:0,
        vyu:0
    }
})
playerone.draw()
console.log(playerone)


const playertwo = new spritetwo({
    
    position:{
        x:800,
        y:0
    },
    velocity:{
        vxl:0,
        vxr:0,
        vyd:0,
        vyu:0
    }
})
playertwo.draw()
console.log(playertwo)


function animateFrames() {
    ctext.fillStyle = 'white'
    ctext.fillRect(0,0,canvas.width,canvas.height)
    playerone.update()
    playertwo.update()
    window.requestAnimationFrame(animateFrames)
}
animateFrames()

/* CONTROLS */

window.addEventListener('keydown', function(p){
    /*first player controls*/
    if (p.code === 'KeyD') {
        playerone.velocity.vxr = 5
        console.log('D key was pressed')
    }
    else if (p.code === 'KeyA') {
        playerone.velocity.vxl = -5
        console.log('A key was pressed')
    }
    else if (p.code === 'KeyW') {
        console.log('W key was pressed')
    }
    else if (p.code === 'KeyS') {
        playerone.height = 100
        console.log(playerone.height)
    }
    
    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.velocity.vxr = 5
        console.log('Right arrow key was pressed')
    }
    else if (p.code === 'ArrowLeft') {
        playertwo.velocity.vxl = -5
        console.log('Left arrow key was pressed')
    }
    else if (p.code === 'ArrowUp') {
        console.log('Up arrow key was pressed')
    }
    else if (p.code === 'ArrowDown') {
        console.log('Down arrow key was pressed')
    }
})

window.addEventListener('keyup', function(p){
    /*first player controls*/
    if (p.code === 'KeyD') {
        playerone.velocity.vxr = 0
        console.log('D key was let go')
    }
    else if (p.code === 'KeyA') {
        playerone.velocity.vxl = 0
        console.log('A key was let go')
    }
    else if (p.code === 'KeyW') {
        console.log('W key was let go')
    }
    else if (p.code === 'KeyS') {
        playerone.height = 200
        playerone.position.y = canvas.height - playerone.height
        console.log(playerone)
    }
    
    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.velocity.vxr = 0
        console.log('Right arrow key was let go')
    }
    else if (p.code === 'ArrowLeft') {
        playertwo.velocity.vxl = 0
        console.log('Left arrow key was let go')
    }
    else if (p.code === 'ArrowUp') {
        console.log('Up arrow key was let go')
    }
    else if (p.code === 'ArrowDown') {
        console.log('Down arrow key was let go')
    }
})