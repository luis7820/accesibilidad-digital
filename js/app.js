var sintesis = window.speechSynthesis;

function leerTexto(texto) {
    sintesis.cancel();
    var voz = new SpeechSynthesisUtterance(texto);
    voz.lang = 'es-ES'; voz.rate = 0.92; sintesis.speak(voz);
    var live = document.getElementById('aria-live');
    if (live) { live.textContent = ''; setTimeout(function() { live.textContent = texto; }, 50); }
}

var timerToast;
function mostrarMensaje(msg) {
    var toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(timerToast);
    timerToast = setTimeout(function() { toast.classList.remove('show'); }, 3000);
}

function pararAudio() { sintesis.cancel(); }

function cambiarFuncion(clase, idBtn, msgOn, msgOff, clave) {
    var activado = document.body.classList.toggle(clase);
    if (clave) localStorage.setItem(clave, activado ? '1' : '0');
    var btn = document.getElementById(idBtn);
    if (btn) { btn.classList.toggle('activo', activado); btn.setAttribute('aria-pressed', activado); }
    var msg = activado ? msgOn : msgOff;
    mostrarMensaje(msg); leerTexto(msg); return activado;
}

function activarAltoContraste() { cambiarFuncion('high-contrast','btn-contraste','Alto contraste activado','Alto contraste desactivado','highContrast'); }
function activarLecturaFacil()  { cambiarFuncion('easy-read','btn-facil','Lectura fácil activada','Lectura fácil desactivada','easyRead'); }
function activarBotonesGrandes(){ cambiarFuncion('large-targets','vcbtn-large','Botones grandes activados','Botones normales restaurados'); }
function activarFuenteDislexia(){ cambiarFuncion('dyslexia-font','vcbtn-dyslexia','Fuente para dislexia activada','Fuente normal restaurada'); }

function cambiarModoOscuro() {
    var activado = document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', activado ? '1' : '0');
    var btn = document.getElementById('theme-btn');
    if (btn) {
        btn.innerHTML = activado ? 'Modo claro' : 'Modo oscuro';
        btn.setAttribute('aria-label', 'Cambiar a ' + (activado ? 'modo claro' : 'modo oscuro') + ' (Alt+D)');
    }
    var msg = activado ? 'Modo oscuro activado' : 'Modo claro activado';
    mostrarMensaje(msg); leerTexto(msg);
}

function cambiarTamanoLetra(cantidad) {
    var actual = parseFloat(getComputedStyle(document.body).fontSize);
    var nuevo = Math.min(64, Math.max(12, actual + cantidad));
    document.body.style.fontSize = nuevo + 'px';
    mostrarMensaje('Tamaño de letra: ' + Math.round(nuevo) + 'px');
}
function restablecerLetra() { document.body.style.fontSize = '17px'; mostrarMensaje('Tamaño de letra restablecido'); }

function aplicarEspaciado(nivel) {
    var v = SPACING_VALUES[nivel];
    document.body.style.letterSpacing = v.letterSpacing;
    document.body.style.wordSpacing   = v.wordSpacing;
    document.body.style.lineHeight    = v.lineHeight;
    var etiq = document.getElementById('spacing-val');
    if (etiq) etiq.textContent = SPACING_LABELS[nivel];
    var prev = document.getElementById('spacing-preview');
    if (prev) prev.textContent = 'Espaciado ' + SPACING_LABELS[nivel].toLowerCase() + '. Así se ve el texto con este ajuste.';
}

var PANELES = ['visual','auditiva','motora','cognitiva'];
var perfilActual = null;
var reglaEl = null;

var accionesPerfil = {
    visual:    function() { if (!document.body.classList.contains('high-contrast')) activarAltoContraste(); },
    auditiva:  function() {},
    motora:    function() { if (!document.body.classList.contains('large-targets')) activarBotonesGrandes(); },
    cognitiva: function() {
        if (!document.body.classList.contains('easy-read')) activarLecturaFacil();
        if (!reglaEl) activarReglaLectura();
    }
};

var limpiezaPerfil = {
    visual:    function() { sintesis.cancel(); if (document.body.classList.contains('high-contrast')) activarAltoContraste(); },
    auditiva:  function() {},
    motora:    function() { if (document.body.classList.contains('large-targets')) activarBotonesGrandes(); },
    cognitiva: function() {
        if (document.body.classList.contains('easy-read')) activarLecturaFacil();
        if (reglaEl && reglaEl.style.display === 'block') activarReglaLectura();
        aplicarEspaciado(0);
        var sr = document.getElementById('spacing-range'); if (sr) sr.value = 0;
    }
};

function seleccionarPerfil(tipo) {
    try { if (perfilActual && perfilActual !== tipo && limpiezaPerfil[perfilActual]) limpiezaPerfil[perfilActual](); } catch(e) {}
    perfilActual = tipo;
    document.querySelectorAll('.pcard').forEach(function(t) { t.classList.remove('selected'); t.setAttribute('aria-pressed','false'); });
    var tarjeta = document.getElementById('profile-' + tipo);
    if (tarjeta) { tarjeta.classList.add('selected'); tarjeta.setAttribute('aria-pressed','true'); }
    var sec = document.querySelector('.sec-profiles'); if (sec) sec.hidden = true;
    PANELES.forEach(function(p) { var el = document.getElementById('panel-'+p); if (el) el.hidden = (p !== tipo); });
    try { if (accionesPerfil[tipo]) accionesPerfil[tipo](); } catch(e) {}
    leerTexto(PROFILE_MSGS[tipo]); mostrarMensaje('Perfil activado');
    var panel = document.getElementById('panel-' + tipo);
    if (panel) panel.scrollIntoView({ behavior:'smooth', block:'start' });
}

function volverPerfiles() {
    try { if (perfilActual && limpiezaPerfil[perfilActual]) limpiezaPerfil[perfilActual](); } catch(e) {}
    perfilActual = null;
    document.querySelectorAll('.pcard').forEach(function(t) { t.classList.remove('selected'); t.setAttribute('aria-pressed','false'); });
    PANELES.forEach(function(p) { var el = document.getElementById('panel-'+p); if (el) el.hidden = true; });
    var sec = document.querySelector('.sec-profiles'); if (sec) sec.hidden = false;
    var titulo = document.getElementById('titulo-perfil');
    if (titulo) titulo.scrollIntoView({ behavior:'smooth', block:'start' });
    leerTexto('Vuelve a elegir tu perfil de accesibilidad');
}

function leerPagina() {
    var contenido = document.getElementById('main-content');
    if (!contenido) { mostrarMensaje('No hay contenido disponible'); return; }
    var texto = 'Leyendo la página. ';
    contenido.querySelectorAll('h2,h3,p').forEach(function(el) { texto += el.innerText.trim() + '. '; });
    leerTexto(texto); mostrarMensaje('Leyendo el contenido de la página');
}

function leerTextoPersonalizado() {
    var ta = document.getElementById('tts-input');
    var vel = document.getElementById('tts-speed');
    if (!ta || !ta.value.trim()) { mostrarMensaje('Escribe o pega un texto primero'); return; }
    sintesis.cancel();
    var voz = new SpeechSynthesisUtterance(ta.value.trim());
    voz.lang = 'es-ES'; voz.rate = vel ? parseFloat(vel.value) : 1;
    sintesis.speak(voz); mostrarMensaje('Leyendo texto…');
}

function activarReglaLectura() {
    var btn = document.getElementById('vcbtn-ruler');
    reglaEl = document.getElementById('reading-ruler'); if (!reglaEl) return;
    var activado = reglaEl.style.display !== 'block';
    reglaEl.style.display = activado ? 'block' : 'none';
    if (activado) document.addEventListener('mousemove', moverRegla);
    else          document.removeEventListener('mousemove', moverRegla);
    if (btn) btn.setAttribute('aria-pressed', activado);
    mostrarMensaje(activado ? 'Regla de lectura activada — sigue al ratón' : 'Regla de lectura desactivada');
}
function moverRegla(e) {
    if (reglaEl && reglaEl.style.display === 'block') reglaEl.style.top = (e.clientY - 18) + 'px';
}

var capaColor = null;
function aplicarFiltroColor(color) {
    document.querySelectorAll('.color-swatch').forEach(function(s) { s.classList.remove('swatch-active'); });
    if (color === 'none' || (capaColor && capaColor.dataset.active === color)) {
        if (capaColor) { capaColor.remove(); capaColor = null; }
        mostrarMensaje('Filtro de color desactivado'); return;
    }
    if (!capaColor) {
        capaColor = document.createElement('div');
        capaColor.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9998;mix-blend-mode:multiply;';
        document.body.appendChild(capaColor);
    }
    capaColor.style.background = color; capaColor.dataset.active = color;
    var btn = document.querySelector('.color-swatch[data-color="'+color+'"]');
    if (btn) btn.classList.add('swatch-active');
    mostrarMensaje('Filtro de color aplicado');
}

function mostrarAlertaVisual(tipo) {
    var d = DATOS_ALERTAS[tipo]; if (!d) return;
    var area = document.getElementById('va-notif-area'); if (!area) return;
    var notif = document.createElement('div');
    notif.className = 'va-notif'; notif.style.borderLeftColor = d.color;
    notif.innerHTML =
        '<div class="va-notif-icon" style="background:'+d.color+'">'+d.icono+'</div>'+
        '<div class="va-notif-body"><div class="va-notif-title">'+d.titulo+'</div><div class="va-notif-desc">'+d.desc+'</div></div>'+
        '<button class="va-notif-close" onclick="this.closest(\'.va-notif\').remove()" aria-label="Cerrar">✕</button>'+
        '<div class="va-notif-progress"><div class="va-notif-bar" style="background:'+d.color+'"></div></div>';
    area.appendChild(notif);
    var todas = area.querySelectorAll('.va-notif'); if (todas.length > 3) todas[0].remove();
    setTimeout(function() { notif.classList.add('va-notif-out'); setTimeout(function() { notif.remove(); }, 350); }, 4200);
}

function iniciarVoz() {
    var SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { mostrarMensaje('Atención: Tu navegador no soporta voz. Usa Chrome.'); return; }
    var rec = new SR(); rec.lang = 'es-ES'; rec.interimResults = false;
    var btnVoz = document.getElementById('voice-btn');
    var estado = document.getElementById('voice-status');
    rec.onstart  = function() { if (btnVoz) btnVoz.classList.add('listening'); if (estado) estado.textContent = 'Escuchando...'; mostrarMensaje('Escuchando...'); };
    rec.onresult = function(e) { var cmd = e.results[0][0].transcript.toLowerCase(); mostrarMensaje('Dijiste: "'+cmd+'"'); procesarComando(cmd); };
    rec.onerror  = function() { mostrarMensaje('Error: No se pudo capturar audio'); };
    rec.onend    = function() { if (btnVoz) btnVoz.classList.remove('listening'); if (estado) estado.textContent = 'Voz'; };
    rec.start();
}

function procesarComando(cmd) {
    if      (cmd.includes('oscuro') || cmd.includes('claro'))   cambiarModoOscuro();
    else if (cmd.includes('grande') || cmd.includes('aumenta')) { cambiarTamanoLetra(4); leerTexto('Letra más grande'); }
    else if (cmd.includes('pequeño')|| cmd.includes('reduce'))  { cambiarTamanoLetra(-4); leerTexto('Letra más pequeña'); }
    else if (cmd.includes('detener')|| cmd.includes('para'))    { pararAudio(); mostrarMensaje('Audio detenido'); }
    else if (cmd.includes('inicio'))  { window.scrollTo({top:0,behavior:'smooth'}); leerTexto('Volviendo al inicio'); }
    else if (cmd.includes('ayuda'))   leerTexto('Puedes usar los botones de la barra superior. También puedes navegar con el teclado.');
    else leerTexto('Comando no reconocido. Prueba con: oscuro, claro, más grande, más pequeño, ayuda o detener.');
}

document.addEventListener('DOMContentLoaded', function() {
    if (localStorage.getItem('darkMode') === '1') {
        document.body.classList.add('dark-mode');
        var btn = document.getElementById('theme-btn');
        if (btn) { btn.innerHTML = 'Modo claro'; btn.setAttribute('aria-label','Cambiar a modo claro (Alt+D)'); }
    }
    if (localStorage.getItem('highContrast') === '1') activarAltoContraste();
    if (localStorage.getItem('easyRead')    === '1') activarLecturaFacil();

    var rangoVel = document.getElementById('tts-speed');
    if (rangoVel) rangoVel.addEventListener('input', function() {
        var v = document.getElementById('speed-val'); if (v) v.textContent = parseFloat(rangoVel.value).toFixed(1) + 'x';
    });

    var acc = {
        'Esc':"pararAudio();mostrarMensaje('Audio detenido')", 'Alt+D':'cambiarModoOscuro()',
        'Alt+V':'iniciarVoz()', 'Alt+1':'leerPagina()', 'Alt+3':'activarAltoContraste()',
        'Alt+4':"cambiarTamanoLetra(4);mostrarMensaje('Texto ampliado')", 'Alt+5':'activarLecturaFacil()'
    };
    var htmlAtajos = SHORTCUTS.map(function(s) {
        return acc[s[0]]
            ? '<button type="button" class="shortcut-item shortcut-btn" onclick="'+acc[s[0]]+'" aria-label="'+s[1]+'"><kbd>'+s[0]+'</kbd><span>'+s[1]+'</span></button>'
            : '<div class="shortcut-item" role="listitem"><kbd>'+s[0]+'</kbd><span>'+s[1]+'</span></div>';
    }).join('');
    var sgEl = document.getElementById('shortcuts-grid'); if (sgEl) sgEl.innerHTML = htmlAtajos;

    var htmlComandos = COMMANDS.map(function(c) { return '<div class="command-tag" role="listitem">Di <code>"'+c[0]+'"</code> → '+c[1]+'</div>'; }).join('');
    var clEl = document.getElementById('commands-list'); if (clEl) clEl.innerHTML = htmlComandos;
});

document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        var acciones = {
            d: cambiarModoOscuro, v: iniciarVoz,
            '+': function(){ cambiarTamanoLetra(2); },
            '-': function(){ cambiarTamanoLetra(-2); },
            '1': leerPagina, '3': activarAltoContraste,
            '4': function(){ cambiarTamanoLetra(4); mostrarMensaje('Texto ampliado'); leerTexto('Texto ampliado'); },
            '5': activarLecturaFacil
        };
        var fn = acciones[e.key.toLowerCase()] || acciones[e.key];
        if (fn) { e.preventDefault(); fn(); }
    }
    if (e.key === 'Escape') { pararAudio(); mostrarMensaje('Audio detenido'); }
});
