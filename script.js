let scene, camera, renderer, stars, starsNear;
const photos = ['OMG.jpg', 'Cantikknyaa.jpg', 'Atikahgeulis.jpg', 'Atikah_cantik.jpg', 'Cantikk.jpg', 'Woww.jpg', 'MBG.jpg', 'Lucuu.jpg', 'PandT.jpg', 'Red.jpg']; 
const quotesRandom = ["I Love You", "Kamu Cantik Banget", "HBD Cantik!", "My Universe", "❤️", "Kamu Hebat"];
let photoIndex = 0;

// --- 1. FUNGSI PRELOADER (Hacker Style) ---
function startLoader() {
    let fill = document.getElementById('fill');
    let msg = document.getElementById('loader-msg');
    let width = 0;
    const messages = [
        "Initializing Secure Connection...",
        "Accessing Memories...",
        "Decrypting Feelings...",
        "Bypassing Heartwall...",
        "Success! Love Found."
    ];

    let interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
            gsap.to("#preloader", { 
                opacity: 0, 
                duration: 1, 
                onComplete: () => {
                    const el = document.getElementById('preloader');
                    if(el) el.remove();
                }
            });
        } else {
            width += Math.random() * 8;
            if(width > 100) width = 100;
            fill.style.width = width + '%';
            msg.innerText = messages[Math.floor(width / 25)] || messages[4];
        }
    }, 150);
}

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    document.getElementById('canvas-container').appendChild(renderer.domElement);

    // Nebula Stars (Layer Jauh)
    const starGeometry = new THREE.BufferGeometry();
    const starVertices = [];
    for (let i = 0; i < 5000; i++) {
        starVertices.push((Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000, (Math.random() - 0.5) * 2000);
    }
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
    const starMaterial = new THREE.PointsMaterial({ size: 1.2, color: 0xffffff, transparent: true, opacity: 0.6 });
    stars = new THREE.Points(starGeometry, starMaterial);
    scene.add(stars);

    // Stars Near (Layer Dekat - Parallax)
    const starGeo2 = new THREE.BufferGeometry();
    const starVertices2 = [];
    for (let i = 0; i < 1000; i++) {
        starVertices2.push((Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000, (Math.random() - 0.5) * 1000);
    }
    starGeo2.setAttribute('position', new THREE.Float32BufferAttribute(starVertices2, 3));
    const starMaterial2 = new THREE.PointsMaterial({ size: 2.5, color: 0xff9a9e, transparent: true, opacity: 0.4 });
    starsNear = new THREE.Points(starGeo2, starMaterial2);
    scene.add(starsNear);

    // Kursor Glow
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    document.body.appendChild(glow);
    window.addEventListener('mousemove', (e) => {
        glow.style.left = e.clientX + 'px';
        glow.style.top = e.clientY + 'px';
    });

    startLoader();
    animate();
}

// --- 2. EFEK RIPPLE HATI PAS KLIK ---
function createHeartRipple(x, y) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-heart';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 1000);
}

function spawnPhoto(x, y) {
    const loader = new THREE.TextureLoader();
    const currentImg = photos[photoIndex % photos.length];
    photoIndex++;

    loader.load(currentImg, (texture) => {
        texture.center.set(0.5, 0.5); 
        const geometry = new THREE.CircleGeometry(1.2, 64); 
        const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide, transparent: true, opacity: 0 });
        const photo = new THREE.Mesh(geometry, material);

        const glowGeo = new THREE.CircleGeometry(1.25, 64);
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.15 });
        const glowMesh = new THREE.Mesh(glowGeo, glowMat);
        photo.add(glowMesh);

        const vector = new THREE.Vector3((x / window.innerWidth) * 2 - 1, -(y / window.innerHeight) * 2 + 1, 0.5);
        vector.unproject(camera);
        const dir = vector.sub(camera.position).normalize();
        const distance = -camera.position.z / dir.z;
        const pos = camera.position.clone().add(dir.multiplyScalar(distance));
        
        photo.position.copy(pos);
        photo.rotation.z = (Math.random() - 0.5) * 0.4;
        scene.add(photo);

        gsap.to(photo.material, { opacity: 1, duration: 1.5 });
        gsap.to(photo.position, { z: Math.random() * 2 + 1, duration: 3, ease: "power2.out" });

        gsap.to(photo.position, {
            y: photo.position.y + (Math.random() - 0.5) * 1,
            duration: 6, repeat: -1, yoyo: true, ease: "sine.inOut"
        });

        if (photoIndex === photos.length) {
            gsap.to(camera.position, { z: 2.2, duration: 5, ease: "power2.inOut" });
            setTimeout(createFirework, 1500); 
            setTimeout(() => {
                document.getElementById('final-card').classList.add('show');
            }, 4500);
        }
    });
}

function createFirework() {
    for(let i = 0; i < 120; i++) {
        const pGeo = new THREE.SphereGeometry(0.015, 8, 8);
        const pMat = new THREE.MeshBasicMaterial({ color: new THREE.Color().setHSL(Math.random(), 1, 0.5) });
        const particle = new THREE.Mesh(pGeo, pMat);
        particle.position.set(0, 0, 2);
        scene.add(particle);
        gsap.to(particle.position, {
            x: (Math.random() - 0.5) * 15,
            y: (Math.random() - 0.5) * 15,
            z: (Math.random() - 0.5) * 10,
            duration: 2.5,
            ease: "power2.out",
            onComplete: () => scene.remove(particle)
        });
    }
}

// --- 3. UCAPAN (ASLI DARI LO) ---
const ucapanUtama = [
    "> Selamat Ulang Tahun ya cantik!!!",
    "> Makasih udah jadi orang hebat, baik, tulus dan juga cantik!!",
    "> Aku bangga banget sama kamu ❤️",
    "> Semoga hadirnya aku bisa bawa kamu jadi pribadi lebih hebat.",
    "> Besar harapan aku kamu tetap terus di samping aku.",
  "> Semoga kamu selalu bahagia ya, meski dengan kondisi apapun itu.",
  "> Aku harap kamu jadi pribadi yang lebih baik kepannya yah.",
  "> Semoga kamu panjang umur.",
    "> Jika harus hidup 10.000 kali, aku akan selalu memilihmu."
];

let lineIndex = 0;
let charIndex = 0;

function typeWriter() {
    const container = document.getElementById("typewriter");
    if (lineIndex < ucapanUtama.length) {
        let currentLine = ucapanUtama[lineIndex];
        if (charIndex < currentLine.length) {
            container.innerHTML += currentLine.charAt(charIndex);
            charIndex++;
            setTimeout(typeWriter, 40);
        } else {
            container.innerHTML += "<br>";
            lineIndex++;
            charIndex = 0;
            const terminal = document.getElementById("terminal-container");
            terminal.scrollTop = terminal.scrollHeight; 
            setTimeout(typeWriter, 1200);
        }
    }
}

function showFloatingText(x, y) {
    const text = document.createElement('div');
    text.className = 'floating-text';
    text.innerText = quotesRandom[Math.floor(Math.random() * quotesRandom.length)];
    text.style.left = x + 'px'; text.style.top = y + 'px';
    document.getElementById('floating-messages-container').appendChild(text);
    gsap.to(text, { y: -100, opacity: 0, duration: 2, onComplete: () => text.remove() });
}

window.addEventListener('mousedown', (e) => {
    createHeartRipple(e.clientX, e.clientY);
    gsap.to("#ui-layer", { opacity: 0, duration: 1 });
    const musik = document.getElementById('musik');
    if(musik.paused) musik.play();
    
    spawnPhoto(e.clientX, e.clientY);
    if(lineIndex === 0) typeWriter();
    showFloatingText(e.clientX, e.clientY);
});

window.addEventListener('mousemove', (e) => {
    if(stars && starsNear) {
        const x = (e.clientX / window.innerWidth) - 0.5;
        const y = (e.clientY / window.innerHeight) - 0.5;
        gsap.to(stars.rotation, { y: x * 0.2, x: y * 0.2, duration: 2 });
        gsap.to(starsNear.rotation, { y: x * 0.5, x: y * 0.5, duration: 1.5 });
    }
});

function animate() {
    requestAnimationFrame(animate);
    if(stars) stars.rotation.y += 0.0003;
    if(starsNear) starsNear.rotation.y -= 0.0005;
    renderer.render(scene, camera);
}

init();

window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});