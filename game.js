const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext('2d')
const grav = 0.4

class spriteONE {
    constructor({position, velocity, currentJumps = 0, jumpMax = 2}) {
        this.position = position
        this.velocity = velocity
        this.height = 200
        this.currentJumps = currentJumps
        this.jumpMax = jumpMax
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, 75, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy

        if (this.position.y + this.height + this.velocity.vy >= canvas.height) {
            this.velocity.vy = 0 
            this.currentJumps = 0
        } else this.velocity.vy += grav
        
    }   
}

class spriteTWO {
    constructor({position, velocity, currentJumps = 0, jumpMax = 2}) {
        this.position = position
        this.velocity = velocity
        this.height = 200
        this.currentJumps = currentJumps
        this.jumpMax = jumpMax
    }

    draw() {
        ctext.fillStyle = 'black'
        ctext.fillRect(this.position.x,this.position.y, 75, this.height)
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy

        /*gravity system */

        if (this.position.y + this.height + this.velocity.vy >= canvas.height) {
            this.velocity.vy = 0
            this.currentJumps = 0
        } else this.velocity.vy += grav

    }   
}

const playerone = new spriteONE({
    
    position:{
        x:0,
        y:0
    },
    velocity:{
        vxl:0,
        vxr:0,
        vy:0,
    }
})
playerone.draw()
console.log(playerone)


const playertwo = new spriteTWO({
    
    position:{
        x:800,
        y:0
    },
    velocity:{
        vxl:0,
        vxr:0,
        vy:0,
    },
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


/*allowing crouch to work in the air */

function playerOneHeight(updatedHeight) {
    const playeroneBottom = playerone.position.y + playerone.height

    playerone.height = updatedHeight
    playerone.position.y = playeroneBottom - updatedHeight
}

function playerTwoHeight(updatedHeight) {
    const playertwoBottom = playertwo.position.y + playertwo.height 

    playertwo.height = updatedHeight
    playertwo.position.y = playertwoBottom - updatedHeight
}


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
        console.log(playerone.currentJumps, playerone.jumpMax)

        if (playerone.currentJumps < playerone.jumpMax) {
            playerone.velocity.vy = -10
            playerone.currentJumps++ 
        }
    }
    else if (p.code === 'KeyS') {
        playerOneHeight(100)
        console.log('S key was pressed')
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
        console.log(playertwo.currentJumps, playertwo.jumpMax)
        
        if (playertwo.currentJumps < playertwo.jumpMax) {
            playertwo.velocity.vy = -10
            playertwo.currentJumps++
        }
        console.log('Up arrow key was pressed')
    }
    else if (p.code === 'ArrowDown') {
        playerTwoHeight(100)
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
        playerOneHeight(200)
        console.log('S key was let go')
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
        playerTwoHeight(200) 
        console.log('Down arrow key was let go')
    }
})