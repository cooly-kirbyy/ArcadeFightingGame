const canvas = document.getElementById('game-screen');
const ctext = canvas.getContext('2d')

const winSound = new Audio('assets/audio/win-sound-effect.mp3')
const tieSound = new Audio('assets/audio/tie-sound-effect.mp3')

const p1HealthBar = document.getElementById('p1health')
const p2HealthBar = document.getElementById('p2health')
const p1BlockBar = document.getElementById('p1block')
const p2BlockBar = document.getElementById('p2block')
const playerOneWin = document.getElementById('playertwoloss')
const playerTwoWin = document.getElementById('playeroneloss')
const playerTie = document.getElementById('playertie')
const tryAgainElement = document.getElementById('restart')

const healthMax = 100
const blockMax = 12
const grav = 0.4

let p1damage = 0
let p2damage = 0

let p1BlockRemaining = blockMax
let p2BlockRemaining = blockMax
let p1TimeOfDamage = 0
let p2TimeOfDamage = 0

let timer = 15
let timerID

let gameisover = false
function timerRun() {
    if (gameisover) return
    const {p2HealthPercent, p1HealthPercent} = healthCalc()

    timerID = setTimeout(timerRun, 1000)
    if (timer > 0) {
        timer--
        document.getElementById('timer').textContent = `${timer}`
    }

    if (timer <= 0) {
    gameisover = true

        if (p1HealthPercent === p2HealthPercent) {
            playerTie.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
            tieSound.play()
        }

        else if (p1HealthPercent > p2HealthPercent) {
            console.log('player one has won')
            playerOneWin.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
            winSound.play()
        }
        else if (p1HealthPercent < p2HealthPercent) {
            console.log('player two has won')
            playerTwoWin.classList.add('win-reveal')
            tryAgainElement.classList.add('win-reveal')
            winSound.play()
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
        this.projectilePlayerHold = false

        this.blockActive = false

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
            position: {x: this.position.x, y:this.position.y},
            width: 60,
            height: 60,
        }

        this.blockingHitBox = {
            position: this.position,
            width: 75,
            height: 70,
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

        // blocking hitbox 
        if (this.blockActive === true) {
        ctext.fillStyle = 'cornflowerblue'
        ctext.fillRect(this.blockingHitBox.position.x, this.blockingHitBox.position.y, this.blockingHitBox.width,this.blockingHitBox.height)
        }
    }

    startProjectile() {
        playerone.projAttackHitbox.position.x = this.position.x
        playerone.projAttackHitbox.position.y = this.position.y
    }
    
    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr

        if (!this.projectilePlayerHold) {
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy
        }

        playerone.projAttackHitbox.position.x += this.velocity.pvxr
        playerone.projAttackHitbox.position.x += this.velocity.pvxl

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
        } else if (!this.projectilePlayerHold) {
            this.velocity.vy += grav
        } 

        // projectile moving across screen
        if (this.projectileActive === true && this.position.x < playertwo.position.x) {
            this.velocity.pvxr = 15
        } else {this.velocity.pvxr = 0}

        if (this.projectileActive === true && this.position.x > playertwo.position.x) {
            this.velocity.pvxl = -15
        } else {this.velocity.pvxl = 0}
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
        this.projectilePlayerHold = true

        setTimeout(() => {
            this.projectileActive = false
        }, 1200)

        setTimeout(() => {
            this.projectilePlayerHold = false
        }, 300)
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

        this.projectileActive = false
        this.projectilePlayerHold = false

        this.blockActive = false

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

        this.projAttackHitbox = {
            position: {x: this.position.x, y:this.position.y},
            width: 60,
            height: 60,
        }

        this.blockingHitBox = {
            position: this.position,
            width: 75,
            height: 70,
        }
    }

    draw() {
        ctext.fillStyle = 'black'
        ctext.fillRect(this.position.x,this.position.y, this.width, this.height)

        // punch hitbox
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

        // kick hitbox
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

        // projectile hitbox
        if (this.projectileActive === true) {
            ctext.fillStyle = 'purple'
            ctext.fillRect(this.projAttackHitbox.position.x, this.projAttackHitbox.position.y, this.projAttackHitbox.width, this.projAttackHitbox.height)
        } 

        // blocking hitbox
        if (this.blockActive === true) {
            ctext.fillStyle = 'darkgray'
            ctext.fillRect(this.blockingHitBox.position.x, this.blockingHitBox.position.y, this.blockingHitBox.width, this.blockingHitBox.height)
        }
    }

    startProjectile() {
        playertwo.projAttackHitbox.position.x = this.position.x
        playertwo.projAttackHitbox.position.y = this.position.y
    }

    update() {
        this.draw()
        this.position.x += this.velocity.vxl
        this.position.x += this.velocity.vxr

        if (!this.projectilePlayerHold) {
        this.position.y += this.velocity.vy
        this.position.y += this.velocity.vy
        }

        playertwo.projAttackHitbox.position.x += this.velocity.pvxr
        playertwo.projAttackHitbox.position.x += this.velocity.pvxl

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
        } else if (!this.projectilePlayerHold) {
            this.velocity.vy += grav
        } 

        // projectile moving across 
        if (this.projectileActive === true && this.position.x < playerone.position.x) {
            this.velocity.pvxr = 15
        } else {this.velocity.pvxr = 0}

        if (this.projectileActive === true && this.position.x > playerone.position.x) {
            this.velocity.pvxl = -15
        } else {this.velocity.pvxl = 0}
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

    projectileAttack() {
        this.projectileActive = true
        this.projectilePlayerHold = true

        setTimeout(() => {
            this.projectileActive = false
        }, 1200)

        setTimeout(() => {
            this.projectilePlayerHold = false
        }, 300)
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
        pvxl:0,
        pvxr:0,
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
        winSound.play()

        playerTwoHeight(60)
        playertwo.width = 150
        gameisover = true
    }
    if (p1HealthPercent <= 0) {
        console.log('player one lost')
        playerTwoWin.classList.add('win-reveal')
        tryAgainElement.classList.add('win-reveal')

        winSound.play()

        playerOneHeight(60)
        playerone.width = 150
        gameisover = true
    }
    if (gameisover) return {p2HealthPercent, p1HealthPercent}
    return {p2HealthPercent, p1HealthPercent}
    
}
healthCalc()

// blocking calculation
function blockCalc() {

    const p1BlockPercent = Math.max(0, (p1BlockRemaining / blockMax) * 100)
    p1BlockBar.style.width = `${p1BlockPercent}%`
    const p2BlockPercent = Math.max(0, (p2BlockRemaining / blockMax) * 100)
    p2BlockBar.style.width = `${p2BlockPercent}%`

    if (p1BlockPercent <= 0) {
        playerone.blockActive = false
        p1BlockBar.style.width = `0%`
    }
    if (p2BlockPercent <= 0) {
        playertwo.blockActive = false
        p2BlockBar.style.width = `0%`
    }

    return {p1BlockPercent, p2BlockPercent}
}
blockCalc()

// collision 
function animateFrames() {
    ctext.fillStyle = 'white'
    ctext.fillRect(0,0,canvas.width,canvas.height)
    playerone.update()
    playertwo.update()
    window.requestAnimationFrame(animateFrames)
    const {p2HealthPercent, p1HealthPercent} = healthCalc()
    blockCalc()

    // PLAYER ONE COLLISION LOGIC 
        // PUNCHING 
    if (playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthr >= playertwo.position.x 
        && playerone.punchAttackHitBox.position.x <= playertwo.position.x + playertwo.width
        && playerone.punchAttackHitBox.position.y + playerone.punchAttackHitBox.height >= playertwo.position.y
        && playerone.punchAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.punchActive && timer > 0 && p1HealthPercent > 0
        && !playerone.punchAlreadyHit) { // RIGHT FACING
            if (playertwo.blockActive === true) {
                p2damage += (6 * .3)
                p2BlockRemaining = Math.max(0, p2BlockRemaining - 1)
                p2TimeOfDamage = Date.now()
            } else p2damage += 6

            playerone.punchAlreadyHit = true
            const health = healthCalc()
            console.log(health)

        }
    if (playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthl <= playertwo.position.x + playertwo.width
        && playerone.punchAttackHitBox.position.x + playerone.punchAttackHitBox.widthl >= playertwo.position.x
        && playerone.punchAttackHitBox.position.y + playerone.punchAttackHitBox.height >= playertwo.position.y
        && playerone.punchAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.punchActive && timer > 0 && p1HealthPercent > 0
        && !playerone.punchAlreadyHit) { // LEFT FACING 
            if (playertwo.blockActive === true) {
                p2damage += (6 * .3)
                p2BlockRemaining = Math.max(0, p2BlockRemaining - 1)
                p2TimeOfDamage = Date.now()
            } else p2damage += 6

            playerone.punchAlreadyHit = true
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
            if (playertwo.blockActive === true) {
                p2damage += (9 * .3)
                p2BlockRemaining = Math.max(0, p2BlockRemaining - 2)
                p2TimeOfDamage = Date.now()
            } else p2damage += 9

            playerone.kickAlreadyHit = true
            const health = healthCalc()
            console.log(health)

        }
    if (playerone.kickAttackHitBox.position.x + playerone.kickAttackHitBox.widthl <= playertwo.position.x + playertwo.width
        && playerone.kickAttackHitBox.position.x + playerone.kickAttackHitBox.widthl >= playertwo.position.x
        && playerone.kickAttackHitBox.position.y + playerone.kickAttackHitBox.height >= playertwo.position.y
        && playerone.kickAttackHitBox.position.y <= playertwo.position.y + playertwo.height
        && playerone.kickActive && timer > 0 && p1HealthPercent > 0
        && !playerone.kickAlreadyHit) { // LEFT FACING
            if (playertwo.blockActive === true) {
                p2damage += (9 * .3)
                p2BlockRemaining = Math.max(0, p2BlockRemaining - 2)
                p2TimeOfDamage = Date.now()
            } else p2damage += 9

            playerone.kickAlreadyHit = true
            const health = healthCalc()
            console.log(health)

        }
        // PROJECTILE 
    if (playerone.projAttackHitbox.position.x + playerone.projAttackHitbox.width <= playertwo.position.x + playertwo.width
        && playerone.projAttackHitbox.position.x + playerone.projAttackHitbox.width >= playertwo.position.x
        && playerone.projAttackHitbox.position.y + playerone.projAttackHitbox.height >= playertwo.position.y
        && playerone.projAttackHitbox.position.y <= playertwo.position.y + playertwo.height
        && playerone.projectileActive && p1HealthPercent > 0) { // LEFT FACING
            playerone.projectileActive = false
            if (timer > 0) {
                if (playertwo.blockActive === true) {
                    p2damage += (14 * .3)
                    p2BlockRemaining = Math.max(0, p2BlockRemaining - 3)
                    p2TimeOfDamage = Date.now()
                } else p2damage += 14

                const health = healthCalc()
                console.log(health)
            }
        }
    if (playerone.projAttackHitbox.position.x + playerone.projAttackHitbox.width >= playertwo.position.x 
        && playerone.projAttackHitbox.position.x <= playertwo.position.x + playertwo.width
        && playerone.projAttackHitbox.position.y + playerone.projAttackHitbox.height >= playertwo.position.y
        && playerone.projAttackHitbox.position.y <= playertwo.position.y + playertwo.height
        && playerone.projectileActive && p1HealthPercent > 0) { // RIGHT FACING
            playerone.projectileActive = false
            if (timer > 0) {
                if (playertwo.blockActive === true) {
                    p2damage += (14 * .3)
                    p2BlockRemaining = Math.max(0, p2BlockRemaining - 3)
                    p2TimeOfDamage = Date.now()
                } else p2damage += 14

                const health = healthCalc()
                console.log(health)
            }
        }

    // PLAYER TWO COLLISION LOGIC
        // PUNCHING
    if (playertwo.punchAttackHitBox.position.x >= playerone.position.x 
        && playertwo.punchAttackHitBox.position.x + playertwo.punchAttackHitBox.widthl <= playerone.position.x + playerone.width
        && playertwo.punchAttackHitBox.position.y + playertwo.punchAttackHitBox.height >= playerone.position.y
        && playertwo.punchAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.punchActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.punchAlreadyHit) { // LEFT FACING

            if (playerone.blockActive === true) { 
                p1damage += (6 * .3)
                p1BlockRemaining = Math.max(0, p1BlockRemaining - 1)
                p1TimeOfDamage = Date.now()
            } else p1damage += 6

            playertwo.punchAlreadyHit = true
            const health = healthCalc()
            console.log(health)

            const blockMeter = blockCalc()
            console.log(blockMeter)
    }
    if (playertwo.punchAttackHitBox.position.x + playertwo.punchAttackHitBox.widthr >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width 
        && playertwo.punchAttackHitBox.position.y + playertwo.punchAttackHitBox.height >= playerone.position.y
        && playertwo.punchAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.punchActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.punchAlreadyHit) { // RIGHT FACING
            if (playerone.blockActive === true) {
                p1damage += (6 * .3)
                p1BlockRemaining = Math.max(0, p1BlockRemaining - 1)
                p1TimeOfDamage = Date.now()
            } else p1damage += 6

            playertwo.punchAlreadyHit = true 
            const health = healthCalc()
            console.log(health)

            const blockMeter = blockCalc()
            console.log(blockMeter)
    }
        // KICKING
    if (playertwo.kickAttackHitBox.position.x >= playerone.position.x 
        && playertwo.kickAttackHitBox.position.x + playertwo.kickAttackHitBox.widthl <= playerone.position.x + playerone.width
        && playertwo.kickAttackHitBox.position.y + playertwo.kickAttackHitBox.height >= playerone.position.y
        && playertwo.kickAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.kickActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.kickAlreadyHit) { // LEFT FACING
            if (playerone.blockActive === true) {
                p1damage += (9 * .3)
                p1BlockRemaining = Math.max(0, p1BlockRemaining - 2)
                p1TimeOfDamage = Date.now()
            } else p1damage += 9

            playertwo.kickAlreadyHit = true
            const health = healthCalc()
            console.log(health)

            const blockMeter = blockCalc()
            console.log(blockMeter)
    }
    if (playertwo.kickAttackHitBox.position.x + playertwo.kickAttackHitBox.widthr >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width 
        && playertwo.kickAttackHitBox.position.y + playertwo.kickAttackHitBox.height >= playerone.position.y
        && playertwo.kickAttackHitBox.position.y <= playerone.position.y + playerone.height
        && playertwo.kickActive && timer > 0 && p2HealthPercent > 0
        && !playertwo.kickAlreadyHit) { // RIGHT FACING
            if (playerone.blockActive === true) {
                p1damage += (9 * .3)
                p1BlockRemaining = Math.max(0, p1BlockRemaining - 2)
                p1TimeOfDamage = Date.now()
            } else p1damage += 9

            playertwo.kickAlreadyHit = true
            const health = healthCalc()
            console.log(health)

            const blockMeter = blockCalc()
            console.log(blockMeter)
        }
        // PROJECTILE
    if (playertwo.projAttackHitbox.position.x + playertwo.projAttackHitbox.width >= playerone.position.x
        && playertwo.position.x + playertwo.width <= playerone.position.x + playerone.width
        && playertwo.projAttackHitbox.position.y + playertwo.projAttackHitbox.height >= playerone.position.y
        && playertwo.projAttackHitbox.position.y <= playerone.position.y + playerone.height
        && playertwo.projectileActive && p2HealthPercent > 0 ) { // RIGHT FACING
            playertwo.projectileActive = false
            if (timer > 0) {
                if (playerone.blockActive === true) {
                    p1damage += (14 * .3)
                    p1BlockRemaining = Math.max(0, p1BlockRemaining - 3)
                    p1TimeOfDamage = Date.now()
                } else p1damage += 14

                const health = healthCalc()
                console.log(health)

                const blockMeter = blockCalc()
                console.log(blockMeter)
            }
        }
    if (playertwo.projAttackHitbox.position.x >= playerone.position.x 
        && playertwo.projAttackHitbox.position.x + playertwo.projAttackHitbox.width <= playerone.position.x + playerone.width
        && playertwo.projAttackHitbox.position.y + playertwo.projAttackHitbox.height >= playerone.position.y
        && playertwo.projAttackHitbox.position.y <= playerone.position.y + playerone.height
        && playertwo.projectileActive && p2HealthPercent > 0) { // LEFT FACING
            playertwo.projectileActive = false
            if (timer > 0) {
                if (playerone.blockActive === true) {
                    p1damage += (14 * .3)
                    p1BlockRemaining = Math.max(0, p1BlockRemaining - 3)
                    p1TimeOfDamage = Date.now()
                } else p1damage += 14

                const health = healthCalc()
                console.log(health)

                const blockMeter = blockCalc()
                console.log(blockMeter)
            }
        }
}

animateFrames()

// block regen
setInterval(() => {
    const p1DamageTimePassed = Date.now() - p1TimeOfDamage
    const p2DamageTimePassed = Date.now() - p2TimeOfDamage 

    if (p1DamageTimePassed >= 2000) {
        p1BlockRemaining = Math.min(blockMax, p1BlockRemaining + 0.1)
        blockCalc()
    }
    if (p2DamageTimePassed >= 2000) {
        p2BlockRemaining = Math.min(blockMax, p2BlockRemaining + 0.1)
        blockCalc()
    }
}, 100)


// allowing crouch in air and setting it from bottom
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


// CONTROLS

const pressedKeys = new Set()
let slideTimerID
let slideBoostCompletedOne = false
let slideBoostCompletedTwo = false

let punchPressTime = 0
let secondPunchPressTime = 0
let punchPressTimeTwo = 0
let secondPunchPressTimeTwo = 0
let projectileTimeLimit = 500

let playerOneDead = false
let playerTwoDead = false

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
                playerone.startProjectile()
                playerone.projectileAttack()
            }
        }
            // SINGLE KEY CONTROLS
        else if (p.code === 'KeyD' && !playerone.projectilePlayerHold) {
            if (playerone.position.x > playertwo.position.x) {
                playerone.blockActive = true
            } 
            playerone.velocity.vxr = 5
        }
        else if (p.code === 'KeyA' && !playerone.projectilePlayerHold) {
            if (playerone.position.x < playertwo.position.x) {
                playerone.blockActive = true   
            }
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
            // projectile combo
        else if (pressedKeys.has('KeyL')) {
            const projTimeElapsed = Date.now() - punchPressTimeTwo
            if (punchPressTimeTwo > 0 && projTimeElapsed <= projectileTimeLimit) {
                secondPunchPressTimeTwo = Date.now()
                console.log('setup went off')
            }
        }
        else if (pressedKeys.has('Semicolon')) {
            const secondProjTimeElapsed = Date.now() - secondPunchPressTimeTwo
            if (secondPunchPressTimeTwo > 0 && secondProjTimeElapsed <= projectileTimeLimit) {
                console.log('projectile went off')
                playertwo.startProjectile()
                playertwo.projectileAttack()
            }
        }
        // SINGLE KEY CONTROLS
        else if (p.code === 'ArrowRight' && !playertwo.projectilePlayerHold) {
            if (playertwo.position.x > playerone.position.x) {
                playertwo.blockActive = true
            }
            playertwo.velocity.vxr = 5
        }
        else if (p.code === 'ArrowLeft' && !playertwo.projectilePlayerHold) {
            if (playertwo.position.x < playerone.position.x) {
                playertwo.blockActive = true
            }
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
            punchPressTimeTwo = Date.now()
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
        playerone.blockActive = false
    }
    else if (p.code === 'KeyA') {
        playerone.blockActive = false
        playerone.velocity.vxl = 0
        slideBoostCompletedOne = false
    }
    else if (p.code === 'KeyS') {
        playerOneHeight(150)
    }

    /*second player controls */
    else if (p.code === 'ArrowRight') {
        playertwo.blockActive = false
        playertwo.velocity.vxr = 0
        slideBoostCompletedTwo = false
    }
    else if (p.code === 'ArrowLeft') { 
        playertwo.blockActive = false
        playertwo.velocity.vxl = 0
        slideBoostCompletedTwo = false
    }
    else if (p.code === 'ArrowDown') {
        playerTwoHeight(150) 
    }
})