var SHORTCUTS = [
    ['Tab',             'Siguiente elemento'],
    ['Shift+Tab',       'Elemento anterior'],
    ['Enter / Espacio', 'Activar botón'],
    ['Esc',             'Parar audio'],
    ['Alt+D',           'Modo oscuro'],
    ['Alt+V',           'Comando de voz'],
    ['Alt+1',           'Leer página'],
    ['Alt+3',           'Alto contraste'],
    ['Alt+4',           'Ampliar texto'],
    ['Alt+5',           'Lectura fácil']
];

var COMMANDS = [
    ['oscuro',      'modo oscuro'],
    ['más grande',  'letra mayor'],
    ['más pequeño', 'letra menor'],
    ['inicio',      'vuelve arriba'],
    ['detener',     'para el audio'],
    ['ayuda',       'escucha opciones']
];

var SPACING_LABELS = ['Normal', 'Amplio', 'Muy amplio', 'Máximo'];

var SPACING_VALUES = [
    { letterSpacing: '',       wordSpacing: '',       lineHeight: '' },
    { letterSpacing: '0.06em', wordSpacing: '0.15em', lineHeight: '2' },
    { letterSpacing: '0.1em',  wordSpacing: '0.25em', lineHeight: '2.4' },
    { letterSpacing: '0.14em', wordSpacing: '0.35em', lineHeight: '2.8' }
];

var PROFILE_MSGS = {
    visual:    'Perfil de discapacidad visual activado. Se han activado el alto contraste y el lector de voz.',
    auditiva:  'Perfil de discapacidad auditiva activado. Las alertas son visuales.',
    motora:    'Perfil de movilidad reducida activado. Los botones son más grandes. Puedes navegar con teclado o voz.',
    cognitiva: 'Perfil de dislexia activado. Se han activado la lectura fácil y la regla de lectura.'
};

var DATOS_ALERTAS = {
    error:   { color:'#ef4444', titulo:'Error del sistema',  desc:'No se pudo completar la acción solicitada.', icono:'✕' },
    mensaje: { color:'#3b82f6', titulo:'Mensaje nuevo',      desc:'Tienes un mensaje sin leer.',                icono:'✉' },
    exito:   { color:'#22c55e', titulo:'Acción completada',  desc:'Los cambios se han guardado correctamente.', icono:'✓' },
    aviso:   { color:'#f59e0b', titulo:'Aviso importante',   desc:'Se requiere tu atención para continuar.',    icono:'⚠' }
};
