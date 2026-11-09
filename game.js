const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext('2d')
const p1HealthBar = document.getElementById('p1health')
const p2HealthBar = document.getElementById('p2health')
const healthMax = 100
const grav = 0.4

class spriteONE {
    constructor({position, velocity, currentJumps = 0, jumpMax = 2}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 75
        this.currentJumps = currentJumps
        this.jumpMax = jumpMax
        this.currentHealth = healthMax
        this.attackActive = false
        this.attackHitBox = {
            position: this.position,
            widthr: 150,
            widthl: -75,
            height: 50
        }
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, this.width, this.height)

        /*attack hitbox */
        if (this.attackActive === true) {
            if (this.position.x < playertwo.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.widthr, this.attackHitBox.height)
            }
            else if (this.position.x > playertwo.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.widthl, this.attackHitBox.height)
            }
        }  
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy

        /*preventing player from running off canvas */
        if (this.position.x <= 0) {
            this.position.x = 0
        }
        if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width
        }

        /*gravity system */
        if (this.position.y + this.height + this.velocity.vy >= canvas.height) {
            this.velocity.vy = 0 
            this.currentJumps = 0
        } else this.velocity.vy += grav
        
    }   

    attack() {
        this.attackActive = true
        setTimeout(() => {
            this.attackActive = false
        }, 10)
    }
}

class spriteTWO {
    constructor({position, velocity, currentJumps = 0, jumpMax = 2}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 75
        this.currentJumps = currentJumps
        this.jumpMax = jumpMax
        this.currentHealth = healthMax

        this.attackActive = false
        this.attackHitBox = {
            position: this.position,
            widthl: -75,
            widthr: 150,
            height: 50
        }
    }

    draw() {
        ctext.fillStyle = 'black'
        ctext.fillRect(this.position.x,this.position.y, this.width, this.height)
        if (this.attackActive === true) {
            if (this.position.x > playerone.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.widthl, this.attackHitBox.height)
            }
            else if (this.position.x < playerone.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.attackHitBox.position.x, this.attackHitBox.position.y, this.attackHitBox.widthr, this.attackHitBox.height)
            }
        }
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy

        /*preventing player from running off canvas */
        if (this.position.x <= 0) {
            this.position.x = 0
        }
        if (this.position.x + this.width >= canvas.width) {
            this.position.x = canvas.width - this.width
        }

        /*gravity system */
        if (this.position.y + this.height + this.velocity.vy >= canvas.height) {
            this.velocity.vy = 0
            this.currentJumps = 0
        } else this.velocity.vy += grav

    }   

    attack() {
        this.attackActive = true
        setTimeout(() => {
            this.attackActive = false
        }, 10)
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


// damage calculation
let p1damage = 0
let p2damage = 0
function healthCalc() {
    const p2HealthPercent = ((healthMax - p2damage) / healthMax) * 100     
    const p1HealthPercent = ((healthMax - p1damage) / healthMax) * 100
    p2HealthBar.style.width = `${p2HealthPercent}%`
    p1HealthBar.style.width = `${p1HealthPercent}%`
    return {p2HealthPercent, p1HealthPercent}
}
healthCalc()


function animateFrames() {
    ctext.fillStyle = 'white'
    ctext.fillRect(0,0,canvas.width,canvas.height)
    playerone.update()
    playertwo.update()
    window.requestAnimationFrame(animateFrames)

    /*player one collision logic */
    if (playerone.attackHitBox.position.x + playerone.attackHitBox.widthr >= playertwo.position.x 
        && playerone.attackHitBox.position.x <= playertwo.position.x + playertwo.width
        && playerone.attackHitBox.position.y + playerone.attackHitBox.height >= playertwo.position.y
        && playerone.attackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.attackActive) { /*for right facing */
            p2damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
    if (playerone.attackHitBox.position.x + playerone.attackHitBox.widthl <= playertwo.position.x + playertwo.width
        && playerone.attackHitBox.position.x + playerone.attackHitBox.widthl >= playertwo.position.x
        && playerone.attackHitBox.position.y + playerone.attackHitBox.height >= playertwo.position.y
        && playerone.attackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.attackActive) { /*for left facing */
            p2damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
 
    /*player two collision logic */
    if (playertwo.attackHitBox.position.x >= playerone.position.x 
        && playertwo.attackHitBox.position.x + playertwo.attackHitBox.widthl <= playerone.position.x + playerone.width
        && playertwo.attackHitBox.position.y + playertwo.attackHitBox.height >= playerone.position.y
        && playertwo.attackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.attackActive) { /*for left facing */
            p1damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
    if (playertwo.attackHitBox.position.x + playertwo.attackHitBox.widthr >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width 
        && playertwo.attackHitBox.position.y + playertwo.attackHitBox.height >= playerone.position.y
        && playertwo.attackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.attackActive) { // for right facing 
            p1damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
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
    }
    else if (p.code === 'KeyA') {
        playerone.velocity.vxl = -5
    }
    else if (p.code === 'KeyW') {
        console.log(playerone.currentJumps, playerone.jumpMax)

        if (playerone.currentJumps < playerone.jumpMax) {
            playerone.velocity.vy = -9
            playerone.currentJumps++ 
        }
    }
    else if (p.code === 'KeyS') {
        playerOneHeight(75)
    }
    else if (p.code === 'KeyF') {
        playerone.attack()
    }

    
    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.velocity.vxr = 5
    }
    else if (p.code === 'ArrowLeft') {
        playertwo.velocity.vxl = -5
    }
    else if (p.code === 'ArrowUp') {
        console.log(playertwo.currentJumps, playertwo.jumpMax)

        if (playertwo.currentJumps < playertwo.jumpMax) {
            playertwo.velocity.vy = -9
            playertwo.currentJumps++
        }
    }
    else if (p.code === 'ArrowDown') {
        playerTwoHeight(75)
    }
    else if (p.code === 'Comma') {
        playertwo.attack()
    }
})

window.addEventListener('keyup', function(p){
    /*first player controls*/
    if (p.code === 'KeyD') {
        playerone.velocity.vxr = 0
    }
    else if (p.code === 'KeyA') {
        playerone.velocity.vxl = 0
    }
    else if (p.code === 'KeyS') {
        playerOneHeight(150)
    }

    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.velocity.vxr = 0
    }
    else if (p.code === 'ArrowLeft') {
        playertwo.velocity.vxl = 0
    }
    else if (p.code === 'ArrowDown') {
        playerTwoHeight(150) 
    }
})