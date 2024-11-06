class PointerParticles {
      constructor(spread, speed, component) {
        const { ctx, pointer, hue } = component;
        this.ctx = ctx;
        this.x = pointer.x;
        this.y = pointer.y;
        this.mx = pointer.mx * 0.1;
        this.my = pointer.my * 0.1;
        this.size = Math.random() + 1;
        this.delay = 0.01;
        this.speed = speed * 0.08;
        this.spread = spread * this.speed;
        this.spreadX = (Math.random() - 0.5) * this.spread - this.mx;
        this.spreadY = (Math.random() - 0.5) * this.spread - this.my;
        this.color = `hsl(${hue}, 90%, 60%)`;
      }

      draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
      }
      collapse() {
        this.size -= this.delay;
      }
      trail() {
        this.x += this.spreadX * this.size;
        this.y += this.spreadY * this.size;
      }
      update() {
        this.draw();
        this.trail();
        this.collapse();
      }
    }

    class PointerParticlesComponent extends HTMLElement {
      constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        
        // Create a canvas element
        this.canvas = document.createElement('canvas');
        this.shadowRoot.append(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        
        this.pointer = { x: 0, y: 0, mx: 0, my: 0 };
        this.hue = 0;
        this.particles = [];
        this.resizeCanvas();

        // Event listeners
        window.addEventListener('resize', this.resizeCanvas.bind(this));
        window.addEventListener('mousemove', this.handleMouseMove.bind(this));
        
        this.animate();
      }

      resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
      }

      handleMouseMove(event) {
        this.pointer.mx = event.movementX;
        this.pointer.my = event.movementY;
        this.pointer.x = event.clientX;
        this.pointer.y = event.clientY;
        this.hue = (this.hue + 1) % 360;
        
        // Create new particles
        for (let i = 0; i < 5; i++) {
          this.particles.push(new PointerParticles(5, 5, this));
        }
      }

      animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles = this.particles.filter(p => p.size > 0);
        this.particles.forEach(p => p.update());
        requestAnimationFrame(this.animate.bind(this));
      }
    }

    // Define custom element
    customElements.define('pointer-particles', PointerParticlesComponent);
 