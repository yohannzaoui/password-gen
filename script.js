const translations = {
    fr: { 
        title: "Password GEN", length: "Longueur", lowercase: "Minuscules (abc)",
        uppercase: "Majuscules (ABC)", numbers: "Chiffres (0-9)", symbols: "Symboles (@#$!)",
        ambiguous: "Exclure ambigus (i, l, 1, 0, o)", btn: "Générer", history: "Historique", 
        error: "Option requise", clear: "Vider l'historique", crack: "Temps pour craquer : ",
        accessibility: "Accessibilité", textSize: "Taille du texte", contrast: "Contraste élevé",
        units: { sec: "sec", min: "min", hours: "heures", days: "jours", years: "ans", centuries: "Siècles 🛡️" }
    },
    en: { 
        title: "Password GEN", length: "Length", lowercase: "Lowercase (abc)",
        uppercase: "Uppercase (ABC)", numbers: "Numbers (0-9)", symbols: "Symbols (@#$!)",
        ambiguous: "Exclude Ambiguous (i, l, 1, 0, o)", btn: "Generate", history: "History", 
        error: "Option required", clear: "Clear History", crack: "Time to crack: ",
        accessibility: "Accessibility", textSize: "Text Size", contrast: "High Contrast",
        units: { sec: "sec", min: "min", hours: "hours", days: "days", years: "years", centuries: "Centuries 🛡️" }
    }
};

let currentLang = localStorage.getItem('lang') || 'fr';
let fontSizeMultiplier = parseFloat(localStorage.getItem('fontSize')) || 1.0;
let isHighContrast = localStorage.getItem('contrast') === 'true';
let passwordHistory = [];

// --- ACCESSIBILITÉ ---
function applyFontSize() {
    document.documentElement.style.fontSize = (fontSizeMultiplier * 16) + 'px';
    localStorage.setItem('fontSize', fontSizeMultiplier);
}

function applyContrast() {
    isHighContrast ? document.body.classList.add('high-contrast') : document.body.classList.remove('high-contrast');
    document.getElementById('contrast-toggle').checked = isHighContrast;
    localStorage.setItem('contrast', isHighContrast);
}

document.getElementById('font-increase').onclick = () => { if(fontSizeMultiplier < 1.4) { fontSizeMultiplier += 0.1; applyFontSize(); }};
document.getElementById('font-decrease').onclick = () => { if(fontSizeMultiplier > 0.8) { fontSizeMultiplier -= 0.1; applyFontSize(); }};
document.getElementById('contrast-toggle').onchange = (e) => { isHighContrast = e.target.checked; applyContrast(); };

// --- UI & THEME ---
function updateUI() {
    const t = translations[currentLang];
    const ids = ['title', 'length', 'lowercase', 'uppercase', 'numbers', 'symbols', 'ambiguous', 'history', 'accessibility', 'textSize', 'contrast'];
    ids.forEach(id => {
        const el = document.getElementById(`ui-${id}`);
        if(el) el.innerText = t[id];
    });
    document.getElementById('ui-btn-text').innerText = t.btn;
    document.getElementById('lang-btn').innerText = currentLang === 'fr' ? 'EN' : 'FR';
    
    const currentPass = document.getElementById('password-display').innerText;
    if (!currentPass.includes('*')) updateStrength(currentPass);
    
    // Crucial : on relance le rendu de l'historique pour traduire le bouton "Vider"
    renderHistory();
}

document.getElementById('lang-btn').onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', currentLang);
    updateUI();
};

const updateThemeIcon = (theme) => {
    document.getElementById('theme-icon').className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
};

document.getElementById('dark-mode-btn').onclick = () => {
    const newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

// --- CORE ---
function renderHistory() {
    const list = document.getElementById('history-list');
    if (passwordHistory.length === 0) { list.innerHTML = ""; return; }
    
    // Le bouton utilise maintenant dynamiquement translations[currentLang].clear
    list.innerHTML = passwordHistory.map(p => `
        <div class="history-item" onclick="navigator.clipboard.writeText('${p}')">
            <span class="text-truncate" style="max-width: 80%">${p}</span><i class="bi bi-copy"></i>
        </div>
    `).join('') + `
        <button class="btn btn-sm btn-link text-danger mt-3 p-0 d-flex align-items-center gap-1" id="clear-h">
            <i class="bi bi-trash3"></i> ${translations[currentLang].clear}
        </button>`;
        
    document.getElementById('clear-h').onclick = () => { passwordHistory = []; renderHistory(); };
}

function updateStrength(p) {
    const bar = document.getElementById('strength-bar');
    let s = Math.min((p.length * 3) + (/[A-Z]/.test(p)?20:0) + (/[0-9]/.test(p)?20:0) + (/[^A-Za-z0-9]/.test(p)?25:0), 100);
    bar.style.width = s + "%";
    bar.className = "progress-bar " + (s < 45 ? "bg-danger" : s < 80 ? "bg-warning" : "bg-success");
    document.getElementById('crack-time-display').innerText = translations[currentLang].crack + getTimeToCrack(p);
}

function getTimeToCrack(p) {
    let charset = (/[a-z]/.test(p)?26:0) + (/[A-Z]/.test(p)?26:0) + (/[0-9]/.test(p)?10:0) + (/[^A-Za-z0-9]/.test(p)?32:0);
    const sec = Math.pow(charset, p.length) / 1e10;
    const u = translations[currentLang].units;
    if (sec < 3600) return Math.floor(sec/60) + " " + u.min;
    if (sec < 86400) return Math.floor(sec/3600) + " " + u.hours;
    if (sec < 31536000) return Math.floor(sec/86400) + " " + u.days;
    return sec < 31536000000 ? Math.floor(sec/31536000) + " " + u.years : u.centuries;
}

// --- EVENTS ---
document.getElementById('generate-btn').onclick = () => {
    let pool = (document.getElementById('lowercase').checked?"abcdefghijklmnopqrstuvwxyz":"") +
               (document.getElementById('uppercase').checked?"ABCDEFGHIJKLMNOPQRSTUVWXYZ":"") +
               (document.getElementById('numbers').checked?"0123456789":"") +
               (document.getElementById('symbols').checked?"!@#$%^&*()_+":"");
    if (document.getElementById('exclude-ambiguous').checked) pool = pool.replace(/[ilLIoO01]/g, "");
    
    const d = document.getElementById('password-display');
    if (!pool) { d.innerText = translations[currentLang].error; d.classList.add('text-danger'); return; }

    let pass = "";
    const len = document.getElementById('length-slider').value;
    for (let i = 0; i < len; i++) pass += pool.charAt(Math.floor(Math.random() * pool.length));
    
    d.innerText = pass; d.classList.remove('text-danger');
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: pass, width: 128, height: 128 });
    passwordHistory.unshift(pass); if (passwordHistory.length > 5) passwordHistory.pop();
    renderHistory(); updateStrength(pass);
};

document.getElementById('copy-btn').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('password-display').innerText);
    const i = document.querySelector('#copy-btn i'); i.className = 'bi bi-check-lg text-success';
    setTimeout(() => i.className = 'bi bi-clipboard', 1500);
};

document.getElementById('visibility-toggle').onclick = () => {
    document.getElementById('password-display').classList.toggle('password-hidden');
    const i = document.querySelector('#visibility-toggle i'); i.classList.toggle('bi-eye'); i.classList.toggle('bi-eye-slash');
};

document.getElementById('qr-toggle').onclick = () => document.getElementById('qr-container').classList.toggle('d-none');
document.getElementById('length-slider').oninput = (e) => document.getElementById('length-val').innerText = e.target.value;

window.onload = () => {
    applyFontSize(); applyContrast();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
    updateUI();
    document.getElementById('generate-btn').click();
};
