//toq kod go e pravil misho 
const canvas = document.getElementById('tetris-bg'); // Zima canvas elementa ot HTML po ID
const ctx = canvas.getContext('2d'); // Zima 2D konteksta za risuvane
canvas.width = window.innerWidth; // Zadavame shirina na canvasa da e kolkoto celiq ekran
canvas.height = window.innerHeight; // Zadavame visochina na canvasa da e kolkoto celiq ekran

const shapes = [ // Masiv s tetrisinite formi (I, O, T, J, L, S, Z)
    [[1,1,1,1]],               // I
    [[1,1],[1,1]],             // O
    [[0,1,0],[1,1,1]],         // T
    [[1,0,0],[1,1,1]],         // J
    [[0,0,1],[1,1,1]],         // L
    [[0,1,1],[1,1,0]],         // S
    [[1,1,0],[0,1,1]]          // Z
];

const blocks = []; // Masiv, koyto shte sudurza vsichkite padashchi blokcheta

// Klas za suzdavane na padashchi tetris formi
class FallingBlock {
    constructor() {
        this.shape = shapes[Math.floor(Math.random() * shapes.length)]; // Sluchayna forma ot shapes
        this.size = 15; // Razmer na edna kletka ot formata
        this.x = Math.random() * canvas.width; // Sluchayna poziciya po X
        this.y = -this.shape.length * this.size; // Startira izvun ekrana (nagore)
        this.speed = 0.5 + Math.random() * 1; // Sluchayna skorost na padane
        this.color = `hsl(${Math.random()*360}, 90%, 60%)`; // Sluchayen цvят s HSL
    }

    draw() {
        ctx.fillStyle = this.color; // Zadavame cveta za zapulvane
        for (let row = 0; row < this.shape.length; row++) { // Minavame po redove
            for (let col = 0; col < this.shape[row].length; col++) { // Minavame po koloni
                if (this.shape[row][col]) { // Ako e 1, risuvame kvadratche
                    ctx.fillRect(
                        this.x + col * this.size, // X koordinata
                        this.y + row * this.size, // Y koordinata
                        this.size - 1, // Shirinata (s 1 pixel meka)
                        this.size - 1  // Visochinata (s 1 pixel meka)
                    );
                }
            }
        }
    }

    update() {
        this.y += this.speed; // Aktualizirame poziciyata na blokcheto po Y (padane)
        if (this.y > canvas.height) { // Ako e izlezlo izvun ekrana
            this.y = -this.shape.length * this.size; // Startira pak nagore
            this.x = Math.random() * canvas.width; // Nova sluchayna poziciya po X
            this.shape = shapes[Math.floor(Math.random() * shapes.length)]; // Nova sluchayna forma
        }
        this.draw(); // Risuvame blokcheto
    }
}

// Sazdavame 50 padashchi blokcheta i gi slagame v masiva
for (let i = 0; i < 50; i++) {
    blocks.push(new FallingBlock());
}

// Funkciya za animaciya (izpulnyava se postoyanno)
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Iztivame canvas-a
    blocks.forEach(block => block.update()); // Aktualizirame vsichki blokcheta
    requestAnimationFrame(animate); // Povikvame funkciyata pak za sledvashtata ramka
}

animate(); // Startirame animaciyata
