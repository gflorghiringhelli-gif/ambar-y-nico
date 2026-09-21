let revealedCount = 0;
let yaAbrio = false;
let explosionActivada = false;

// DETECTAR INVITADO VIP POR URL (?para=Familia+Perez)
function cargarInvitadoVIP() {
    const urlParams = new URLSearchParams(window.location.search);
    const para = urlParams.get('para');
    if (para) {
        const bloqueVip = document.getElementById('bloque-vip');
        const nombreVip = document.getElementById('nombre-invitado-vip');
        if (bloqueVip && nombreVip) {
            nombreVip.innerText = para.replace(/\+/g, ' ');
            bloqueVip.classList.remove('oculto');
        }
    }
}

function activarInvitacion() {
    if (yaAbrio) return;
    yaAbrio = true;

    const imgSobre = document.getElementById('imgSobreEstetica');
    const videoSobre = document.getElementById('videoSobre');
    const intro = document.getElementById('contenedor-principal');
    const btnTexto = document.getElementById('btn-toca-abrir');
    const musica = document.getElementById('musicaInvitacion');
    const musicIcon = document.getElementById('music-toggle');

    if (btnTexto) {
        btnTexto.innerHTML = "Abriendo... ✉️";
        btnTexto.style.opacity = "0.7";
    }

    if (musica) {
        musica.currentTime = 0;
        musica.play().catch(e => console.log("Audio play err:", e));
    }
    if (musicIcon) musicIcon.style.display = 'flex';

    if (imgSobre) imgSobre.style.opacity = '0';
    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();

        const proceder = () => {
            transicionAFinal(intro);
        };

        if (playPromise !== undefined) {
            playPromise.then(() => {
                videoSobre.onended = proceder;
            }).catch(proceder);
        } else {
            videoSobre.onended = proceder;
        }
        setTimeout(proceder, 3500);
    } else {
        transicionAFinal(intro);
    }
}

function transicionAFinal(intro) {
    if (intro) {
        intro.style.transition = "opacity 0.8s ease";
        intro.style.opacity = '0';
    }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const seccionFinal = document.getElementById('seccion-final');

        if (seccionFinal) seccionFinal.classList.remove('oculto');

        window.scrollTo(0, 0);
        cargarInvitadoVIP();
        iniciarAnimacionesScroll();
        iniciarAcordeonFAQ();
        setInterval(actualizarContador, 1000);
        actualizarContador();
    }, 800);
}

function toggleMusic() {
    const musica = document.getElementById('musicaInvitacion');
    const icon = document.getElementById('music-toggle');
    if (!musica || !icon) return;
    if (musica.paused) {
        musica.play();
        icon.innerHTML = '<i class="fa-solid fa-music"></i>';
    } else {
        musica.pause();
        icon.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
    }
}

function iniciarAnimacionesScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('active');
        });
    }, { threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// ACORDEON FAQ INTERACTIVO
function iniciarAcordeonFAQ() {
    const items = document.querySelectorAll('.faq-item-interactive');
    items.forEach(item => {
        const btn = item.querySelector('.faq-question');
        btn.addEventListener('click', () => {
            items.forEach(other => {
                if (other !== item) other.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });
}

function revealDate(btn, text) {
  if (!btn.classList.contains('revealed')) {
    btn.innerText = text;
    btn.classList.add('revealed');
    revealedCount++;

    if (revealedCount === 3) {
      const msg = document.getElementById('revealed-date-msg');
      if (msg) msg.classList.add('show-revealed');
      if (!explosionActivada) {
          explosionActivada = true;
          lanzarParticulasCelestes();
      }
    }
  }
}

// PARTÍCULAS / PETALOS CELESTES SUAVES
function lanzarParticulasCelestes() {
    const c = document.getElementById('petalsCanvas');
    if (!c) return;
    const ctx = c.getContext('2d');
    c.width = window.innerWidth;
    c.height = window.innerHeight;

    const particulas = [];
    for (let i = 0; i < 35; i++) {
        particulas.push({
            x: Math.random() * c.width, y: -30,
            size: Math.random() * 4 + 3,
            speedY: Math.random() * 1.5 + 0.6,
            speedX: (Math.random() - 0.5) * 1.0,
            angle: Math.random() * Math.PI * 2,
            opacity: Math.random() * 0.7 + 0.2
        });
    }

    let frames = 0;
    function animar() {
        ctx.clearRect(0, 0, c.width, c.height);
        particulas.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = '#d7ecff';
            ctx.beginPath();
            ctx.arc(0, 0, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();

            p.y += p.speedY;
            p.x += Math.sin(frames * 0.02) * 0.4 + p.speedX;
        });
        frames++;
        if (frames < 360) requestAnimationFrame(animar);
        else ctx.clearRect(0, 0, c.width, c.height);
    }
    animar();
}

function actualizarContador() {
   const meta = new Date("2027-01-16T20:30:00").getTime();
   const dif = meta - new Date().getTime();
   if (dif > 0) {
       document.getElementById('days').innerText = Math.floor(dif / 86400000).toString().padStart(2, '0');
       document.getElementById('hours').innerText = Math.floor((dif % 86400000) / 3600000).toString().padStart(2, '0');
       document.getElementById('minutes').innerText = Math.floor((dif % 3600000) / 60000).toString().padStart(2, '0');
       document.getElementById('seconds').innerText = Math.floor((dif % 60000) / 1000).toString().padStart(2, '0');
   }
}

function copiarAlias() {
    const alias = document.getElementById('alias-text').innerText;
    navigator.clipboard.writeText(alias).then(() => {
        mostrarToast('¡Alias copiado al portapapeles! 📋');
    });
}

function mostrarToast(txt) {
  const toast = document.getElementById('toast');
  if (toast) {
    toast.innerText = txt;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 2800);
  }
}