<script>
        const canvas = document.getElementById('tetris-bg');
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const shapes = [
            [[1,1,1,1]],               // I
            [[1,1],[1,1]],             // O
            [[0,1,0],[1,1,1]],         // T
            [[1,0,0],[1,1,1]],         // J
            [[0,0,1],[1,1,1]],         // L
            [[0,1,1],[1,1,0]],         // S
            [[1,1,0],[0,1,1]]          // Z
        ];

        const blocks = [];

        class FallingBlock {
            constructor() {
                this.shape = shapes[Math.floor(Math.random() * shapes.length)];
                this.size = 15; // По-малки блокчета
                this.x = Math.random() * canvas.width;
                this.y = -this.shape.length * this.size;
                this.speed = 0.5 + Math.random() * 1;
                this.color = `hsl(${Math.random()*360}, 90%, 60%)`;
            }

            draw() {
                ctx.fillStyle = this.color;
                for (let row = 0; row < this.shape.length; row++) {
                    for (let col = 0; col < this.shape[row].length; col++) {
                        if (this.shape[row][col]) {
                            ctx.fillRect(
                                this.x + col * this.size,
                                this.y + row * this.size,
                                this.size - 1,
                                this.size - 1
                            );
                        }
                    }
                }
            }

            update() {
                this.y += this.speed;
                if (this.y > canvas.height) {
                    this.y = -this.shape.length * this.size;
                    this.x = Math.random() * canvas.width;
                    this.shape = shapes[Math.floor(Math.random() * shapes.length)];
                }
                this.draw();
            }
        }

        for (let i = 0; i < 50; i++) {
            blocks.push(new FallingBlock());
        }

        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            blocks.forEach(block => block.update());
            requestAnimationFrame(animate);
        }

        animate();
    </script>
