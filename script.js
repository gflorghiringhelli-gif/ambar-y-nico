let revealedCount = 0;
let yaAbrio = false;

// Detectar invitado VIP ?para=Familia+Perez
function cargarVIP() {
    const params = new URLSearchParams(window.location.search);
    const para = params.get('para');
    if (para) {
        const badge = document.getElementById('bloque-vip');
        const nameEl = document.getElementById('nombre-invitado-vip');
        if (badge && nameEl) {
            nameEl.innerText = para.replace(/\+/g, ' ');
            badge.classList.remove('oculto');
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

    if (btnTexto) { btnTexto.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Abriendo...'; btnTexto.style.opacity = "0.7"; }
    if (musica) { musica.currentTime = 0; musica.play().catch(e => console.log("Audio play err:", e)); }
    if (musicIcon) musicIcon.style.display = 'flex';
    if (imgSobre) imgSobre.style.opacity = '0';

    if (videoSobre) {
        videoSobre.style.display = 'block';
        videoSobre.currentTime = 0;
        let playPromise = videoSobre.play();
        const finish = () => transitionToMain(intro);
        if (playPromise !== undefined) {
            playPromise.then(() => { videoSobre.onended = finish; }).catch(finish);
        } else { videoSobre.onended = finish; }
        setTimeout(finish, 3800);
    } else { transitionToMain(intro); }
}

function transitionToMain(intro) {
    if (intro) { intro.style.opacity = '0'; }
    setTimeout(() => {
        if (intro) intro.style.display = 'none';
        const finalSec = document.getElementById('seccion-final');
        if (finalSec) finalSec.classList.remove('oculto');
        window.scrollTo(0, 0);
        cargarVIP();
        iniciarScrollAnimations();
        setInterval(actualizarContador, 1000);
        actualizarContador();
    }, 850);
}

function toggleMusic() {
    const m = document.getElementById('musicaInvitacion');
    const ic = document.getElementById('music-toggle');
    if (!m || !ic) return;
    if (m.paused) { m.play(); ic.innerHTML = '<i class="fa-solid fa-music"></i>'; }
    else { m.pause(); ic.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>'; }
}

function iniciarScrollAnimations() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('active'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

function revealDate(btn, text) {
    if (!btn.classList.contains('revealed')) {
        btn.innerText = text;
        btn.classList.add('revealed');
        revealedCount++;
        if (revealedCount === 3) {
            const msg = document.getElementById('revealed-date-msg');
            if (msg) msg.classList.add('show-revealed');
        }
    }
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

// Acordeón FAQ suave
document.querySelectorAll('.faq-item-clean').forEach(item => {
    item.addEventListener('click', () => {
        item.classList.toggle('active');
    });
});

function copiarAlias() {
    const alias = document.getElementById('alias-text').innerText;
    navigator.clipboard.writeText(alias).then(() => {
        const t = document.getElementById('toast');
        t.classList.add('show');
        setTimeout(() => t.classList.remove('show'), 2800);
    });
}