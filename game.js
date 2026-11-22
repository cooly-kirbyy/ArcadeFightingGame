const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext('2d')
const p1HealthBar = document.getElementById('p1health')
const p2HealthBar = document.getElementById('p2health')
const playerOneWin = document.getElementById('playertwoloss')
const playerTwoWin = document.getElementById('playeroneloss')
const playerTie = document.getElementById('playertie')
const tryAgainElement = document.getElementById('restart')
const healthMax = 100
const grav = 0.4

let p1damage = 0
let p2damage = 0

let timer = 15
let timerID
function timerRun() {
    const {p2HealthPercent, p1HealthPercent} = healthCalc()

   timerID = setTimeout(timerRun, 1000)
    if (timer > 0) {
        timer--
        document.getElementById('timer').textContent = `${timer}`
    }

    if (timer <= 0) {
        if (p1HealthPercent === p2HealthPercent) {
            playerTie.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
        }

        else if (p1HealthPercent > p2HealthPercent) {
            console.log('player one has won')
            playerOneWin.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
        }
        else if (p1HealthPercent < p2HealthPercent) {
            console.log('player two has won')
            playerTwoWin.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
        }
    } 

    if (p1HealthPercent <= 0 || p2HealthPercent <= 0) {
        clearTimeout(timerID)
    }
}
timerRun()

class spriteONE {
    constructor({position, velocity, currentJumps = 0, jumpMax = 2}) {
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 75
        this.currentJumps = currentJumps
        this.jumpMax = jumpMax
        this.currentHealth = healthMax

        this.punchActive = false
        this.punchCooldown = false
        this.punchAlreadyHit = false

        this.kickActive = false
        this.kickCooldown = false
        this.kickAlreadyHit = false

        this.projectileActive = false

        this.punchAttackHitBox = {
            position: this.position,
            widthr: 155,
            widthl: -80,
            height: 50
        }

        this.kickAttackHitBox = {
            position: this.position,
            widthr: 195,
            widthl: -120,
            height: 50,
        }

        this.projAttackHitbox = {
            position: {x: this.position.x, y: this.position.y},
            width: 60,
            height: 60,
        }
    }

    draw() {
        ctext.fillStyle = 'blue'
        ctext.fillRect(this.position.x,this.position.y, this.width, this.height)

        /* punch attack hitbox */
        if (this.punchActive === true) {
            if (this.position.x < playertwo.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.punchAttackHitBox.position.x, this.punchAttackHitBox.position.y, this.punchAttackHitBox.widthr, this.punchAttackHitBox.height)
            }
            else if (this.position.x > playertwo.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.punchAttackHitBox.position.x, this.punchAttackHitBox.position.y, this.punchAttackHitBox.widthl, this.punchAttackHitBox.height)
            }
        }  

        // kick attack hitbox
        if (this.kickActive === true) {
            if (this.position.x < playertwo.position.x) {
                ctext.fillStyle = 'red'
                ctext.fillRect(this.kickAttackHitBox.position.x, this.kickAttackHitBox.position.y + 25, this.kickAttackHitBox.widthr, this.kickAttackHitBox.height)
            }
            else if (this.position.x > playertwo.position.x) {
                ctext.fillStyle = 'red'
                ctext.fillRect(this.kickAttackHitBox.position.x, this.kickAttackHitBox.position.y + 25, this.kickAttackHitBox.widthl, this.kickAttackHitBox.height)
            }
        }

    
        // projectile attack hitbox 
        if (this.projectileActive === true) {
            ctext.fillStyle = 'purple'
            ctext.fillRect(this.projAttackHitbox.position.x, this.projAttackHitbox.position.y, this.projAttackHitbox.width, this.projAttackHitbox.height)
        } 
    }
    
    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy

        this.projAttackHitbox.position.x += this.velocity.pvxr


        // this.projAttackHitbox.position.x = this.position += this.velocity.pvxl
        // this.projAttackHitbox.position.x = this.position += this.velocity.pvxr

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
        
        // projectile moving across screen
        if (this.projectileActive === true && this.position.x < playertwo.position.x) {
            this.velocity.pvxr = 10
        }
        if (this.projectileActive === true && this.position.x > playertwo.position.x) {
            this.velocity.pvxl = -10
        } 
    }   

    punchAttack() {
        if (this.punchCooldown) return
        if (this.kickCooldown) return

        this.punchCooldown = true
        this.punchActive = true
        this.punchAlreadyHit = false

        setTimeout(() => {
            this.punchActive = false
        }, 100)

        setTimeout(() => {
            this.punchCooldown = false
        },180)
    }

    kickAttack() {
        if (this.kickCooldown) return
        if (this.punchCooldown) return

        this.kickCooldown = true
        this.kickActive = true
        this.kickAlreadyHit = false

        setTimeout(() => {
            this.kickActive = false
        }, 100)

        setTimeout(() => {
            this.kickCooldown = false
        },250)
    }

    projectileAttack() {
        this.projectileActive = true

        setTimeout(() => {
            this.projectileActive = false
        }, 1000)
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

        this.punchActive = false
        this.punchCooldown = false
        this.punchAlreadyHit = false

        this.kickActive = false
        this.kickCooldown = false
        this.kickAlreadyHit = false

        this.punchAttackHitBox = {
            position: this.position,
            widthl: -80,
            widthr: 155,
            height: 50
        }

        this.kickAttackHitBox = {
            position: this.position,
            widthr: 195,
            widthl: -120,
            height: 50,
        }
    }

    draw() {
        ctext.fillStyle = 'black'
        ctext.fillRect(this.position.x,this.position.y, this.width, this.height)

        if (this.punchActive === true) {
            if (this.position.x > playerone.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.punchAttackHitBox.position.x, this.punchAttackHitBox.position.y, this.punchAttackHitBox.widthl, this.punchAttackHitBox.height)
            }
            else if (this.position.x < playerone.position.x) {
                ctext.fillStyle = 'yellow'
                ctext.fillRect(this.punchAttackHitBox.position.x, this.punchAttackHitBox.position.y, this.punchAttackHitBox.widthr, this.punchAttackHitBox.height)
            }
        }

        if (this.kickActive === true) {
            if (this.position.x > playerone.position.x) {
                ctext.fillStyle = 'red'
                ctext.fillRect(this.kickAttackHitBox.position.x, this.kickAttackHitBox.position.y + 25, this.kickAttackHitBox.widthl, this.kickAttackHitBox.height)
            }
            else if (this.position.x < playerone.position.x) {
                ctext.fillStyle = 'red'
                ctext.fillRect(this.kickAttackHitBox.position.x, this.kickAttackHitBox.position.y + 25, this.kickAttackHitBox.widthr, this.kickAttackHitBox.height)
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

    punchAttack() {
        if (this.punchCooldown) return
        if (this.kickCooldown) return

        this.punchCooldown = true
        this.punchActive = true
        this.punchAlreadyHit = false

        setTimeout(() => {
            this.punchActive = false
        }, 100)

        setTimeout(() => {
            this.punchCooldown = false
        }, 180)
    }

    kickAttack() {
        if (this.kickCooldown) return
        if (this.punchCooldown) return

        this.kickCooldown = true
        this.kickActive = true
        this.kickAlreadyHit = false

        setTimeout(() => {
            this.kickActive = false
        }, 100)

        setTimeout(() => {
            this.kickCooldown = false
        },250)
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
        pvxl:0,
        pvxr:0,
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
function healthCalc() {
    const p2HealthPercent = ((healthMax - p2damage) / healthMax) * 100     
    const p1HealthPercent = ((healthMax - p1damage) / healthMax) * 100
    p2HealthBar.style.width = `${p2HealthPercent}%`
    p1HealthBar.style.width = `${p1HealthPercent}%`

    if (p2HealthPercent <= 0) {
        console.log('player two lost')
        playerOneWin.classList.add('win-reveal')
        tryAgainElement.classList.add('win-reveal')

        playerTwoHeight(60)
        playertwo.width = 150
    }
    if (p1HealthPercent <= 0) {
        console.log('player one lost')
        playerTwoWin.classList.add('win-reveal')
        tryAgainElement.classList.add('win-reveal')

        playerOneHeight(60)
        playerone.width = 150
    }
    return {p2HealthPercent, p1HealthPercent}
}
healthCalc()


function animateFrames() {
    ctext.fillStyle = 'white'
    ctext.fillRect(0,0,canvas.width,canvas.height)
    playerone.update()
    playertwo.update()
    window.requestAnimationFrame(animateFrames)
    const {p2HealthPercent, p1HealthPercent} = healthCalc()

    // PLAYER ONE COLLISION LOGIC 
        // PUNCHING 
    if (playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthr >= playertwo.position.x 
        && playerone.punchAttackHitBox.position.x <= playertwo.position.x + playertwo.width
        && playerone.punchAttackHitBox.position.y + playerone.punchAttackHitBox.height >= playertwo.position.y
        && playerone.punchAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.punchActive && timer > 0 && p1HealthPercent > 0
        && !playerone.punchAlreadyHit) { // RIGHT FACING
            playerone.punchAlreadyHit = true
            p2damage += 6.25
            const health = healthCalc()
            console.log(health)
        }
    if (playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthl <= playertwo.position.x + playertwo.width
        && playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthl >= playertwo.position.x
        && playerone.punchAttackHitBox.position.y + playerone.punchAttackHitBox.height >= playertwo.position.y
        && playerone.punchAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.punchActive && timer > 0 && p1HealthPercent > 0
        && !playerone.punchAlreadyHit) { // LEFT FACING 
            playerone.punchAlreadyHit = true
            p2damage += 6
            const health = healthCalc()
            console.log(health)
        }
        // KICKING
    if (playerone.kickAttackHitBox.position.x + playerone.kickAttackHitBox.widthr >= playertwo.position.x 
        && playerone.kickAttackHitBox.position.x <= playertwo.position.x + playertwo.width
        && playerone.kickAttackHitBox.position.y + playerone.kickAttackHitBox.height >= playertwo.position.y
        && playerone.kickAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.kickActive && timer > 0 && p1HealthPercent > 0
        && !playerone.kickAlreadyHit) { // RIGHT FACING
            playerone.kickAlreadyHit = true
            p2damage += 9
            const health = healthCalc()
            console.log(health)
        }
    if (playerone.kickAttackHitBox.position.x + playerone.kickAttackHitBox.widthl <= playertwo.position.x + playertwo.width
        && playerone.kickAttackHitBox.position.x + playerone.kickAttackHitBox.widthl >= playertwo.position.x
        && playerone.kickAttackHitBox.position.y + playerone.kickAttackHitBox.height >= playertwo.position.y
        && playerone.kickAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.kickActive && timer > 0 && p1HealthPercent > 0
        && !playerone.kickAlreadyHit) { // LEFT FACING
            playerone.kickAlreadyHit = true
            p2damage += 9
            const health = healthCalc()
            console.log(health)
        }



    // PLAYER TWO COLLISION LOGIC
        // PUNCHING
    if (playertwo.punchAttackHitBox.position.x >= playerone.position.x 
        && playertwo.punchAttackHitBox.position.x + playertwo.punchAttackHitBox.widthl <= playerone.position.x + playerone.width
        && playertwo.punchAttackHitBox.position.y + playertwo.punchAttackHitBox.height >= playerone.position.y
        && playertwo.punchAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.punchActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.punchAlreadyHit) { // LEFT FACING
            playertwo.punchAlreadyHit = true
            p1damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
    if (playertwo.punchAttackHitBox.position.x + playertwo.punchAttackHitBox.widthr >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width 
        && playertwo.punchAttackHitBox.position.y + playertwo.punchAttackHitBox.height >= playerone.position.y
        && playertwo.punchAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.punchActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.punchAlreadyHit) { // RIGHT FACING
            playertwo.punchAlreadyHit = true 
            p1damage += 6.25
            const health = healthCalc()
            console.log(health)
    }
        // KICKING
    if (playertwo.kickAttackHitBox.position.x >= playerone.position.x 
        && playertwo.kickAttackHitBox.position.x + playertwo.kickAttackHitBox.widthl <= playerone.position.x + playerone.width
        && playertwo.kickAttackHitBox.position.y + playertwo.kickAttackHitBox.height >= playerone.position.y
        && playertwo.kickAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.kickActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.kickAlreadyHit) { // LEFT FACING
            playertwo.kickAlreadyHit = true
            p1damage += 9
            const health = healthCalc()
            console.log(health)
    }
    if (playertwo.kickAttackHitBox.position.x + playertwo.kickAttackHitBox.widthr >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width 
        && playertwo.kickAttackHitBox.position.y + playertwo.kickAttackHitBox.height >= playerone.position.y
        && playertwo.kickAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.kickActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.kickAlreadyHit) { // RIGHT FACING
            playertwo.kickAlreadyHit = true
            p1damage += 9
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

const pressedKeys = new Set()
let slideTimerID
let slideBoostCompletedOne = false
let slideBoostCompletedTwo = false

let punchPressTime = 0
let secondPunchPressTime = 0
let projectileTimeLimit = 500

window.addEventListener('keydown', function(p){
    const {p2HealthPercent, p1HealthPercent} = healthCalc()
    pressedKeys.add(p.code)

        // FIRST PLAYER CONTROLS
    if (p1HealthPercent > 0) {
            // COMBINATIONS 
        if (pressedKeys.has('KeyS') && pressedKeys.has('KeyD')) {

            if (slideBoostCompletedOne === false) {
                playerOneHeight(75)
                playerone.velocity.vxr = 10

                this.setTimeout(() => {
                slideBoostCompletedOne = true
                }, 500)
            }

            if (slideBoostCompletedOne === true) {
                playerone.velocity.vxr = 2.5
            }
        }
        else if (pressedKeys.has('KeyS') && pressedKeys.has('KeyA')) {
            
            if (slideBoostCompletedOne === false) {
                playerOneHeight(75)
                playerone.velocity.vxl = -10

                this.setTimeout(() => {
                    slideBoostCompletedOne = true
                }, 500)
            }

            if (slideBoostCompletedOne === true)
                playerone.velocity.vxl = -2.5
        } 
                //for projectile
        else if (pressedKeys.has('KeyR')) {
            const projTimeElapsed = Date.now() - punchPressTime
            if (punchPressTime > 0 && projTimeElapsed <= projectileTimeLimit) {
                secondPunchPressTime = Date.now()
                console.log('setup went off')
            }
        }
        else if (pressedKeys.has('KeyT')) {
            const secondProjTimeElapsed = Date.now() - secondPunchPressTime
            if (secondPunchPressTime > 0 && secondProjTimeElapsed <= projectileTimeLimit) {
                console.log('projectile went off')
                playerone.projectileAttack()
            }
        }
            // SINGLE KEY CONTROLS
        else if (p.code === 'KeyD') {
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
                console.log('crouching')
            }
        else if (p.code === 'KeyF') {
            playerone.punchAttack()
            console.log(playerone.punchActive)
            punchPressTime = Date.now()
        }
        else if (p.code === 'KeyG') {
            playerone.kickAttack()
            console.log(playerone.kickActive)
        }
    }
    

    // PLAYER TWO CONTROLS
    if (p2HealthPercent > 0) {
        // COMBINATIONS
        if (pressedKeys.has('ArrowRight') && pressedKeys.has('ArrowDown')) {
            if (slideBoostCompletedTwo === false) {
                playerTwoHeight(75)
                playertwo.velocity.vxr = 10

                this.setTimeout(() => {
                slideBoostCompletedTwo = true
                }, 500)
            }
            if (slideBoostCompletedTwo === true) {
                playertwo.velocity.vxr = 2.5
            }
        }
        else if (pressedKeys.has('ArrowLeft') && pressedKeys.has('ArrowDown')) {
            if (slideBoostCompletedTwo === false) {
                playerTwoHeight(75)
                playertwo.velocity.vxl = -10

                this.setTimeout(() => {
                slideBoostCompletedTwo = true
                }, 500)
            }
            if (slideBoostCompletedTwo === true) {
                playertwo.velocity.vxl = -2.5
            }
        }
        // SINGLE KEY CONTROLS
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
            playertwo.punchAttack()
            console.log(playertwo.punchActive)
        }
        else if (p.code === 'Period') {
            playertwo.kickAttack()
        }
    }

})

window.addEventListener('keyup', function(p){
    pressedKeys.delete(p.code)

    // PLAYER ONE CONTROLS 
        // COMBINATIONS
 
        // SINGLE KEY CONTROLS
    if (p.code === 'KeyD') {
        playerone.velocity.vxr = 0
        slideBoostCompletedOne = false
    }
    else if (p.code === 'KeyA') {
        playerone.velocity.vxl = 0
        slideBoostCompletedOne = false
    }
    else if (p.code === 'KeyS') {
        playerOneHeight(150)
    }

    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.velocity.vxr = 0
        slideBoostCompletedTwo = false
    }
    else if (p.code === 'ArrowLeft') {
        playertwo.velocity.vxl = 0
        slideBoostCompletedTwo = false
    }
    else if (p.code === 'ArrowDown') {
        playerTwoHeight(150) 
    }
})