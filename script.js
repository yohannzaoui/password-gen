const translations = {
    fr: { 
        title: "Password GEN", length: "Longueur", lowercase: "Minuscules",
        uppercase: "Majuscules", numbers: "Chiffres", symbols: "Symboles",
        ambiguous: "Exclure ambigus", btn: "Générer", history: "Historique", 
        error: "Option requise", clear: "Vider l'historique", crack: "Temps pour craquer : ",
        accessibility: "Accessibilité", textSize: "Taille du texte", contrast: "Contraste élevé",
        units: { sec: "sec", min: "min", hours: "heures", days: "jours", years: "ans", centuries: "Siècles 🛡️" }
    },
    en: { 
        title: "Password GEN", length: "Length", lowercase: "Lowercase",
        uppercase: "Uppercase", numbers: "Numbers", symbols: "Symbols",
        ambiguous: "Exclude Ambiguous", btn: "Generate", history: "History", 
        error: "Option required", clear: "Clear History", crack: "Time to crack: ",
        accessibility: "Accessibility", textSize: "Text Size", contrast: "High Contrast",
        units: { sec: "sec", min: "min", hours: "hours", days: "days", years: "years", centuries: "Centuries 🛡️" }
    }
};

// --- ÉTAT INITIAL & STORAGE ---
let currentLang = localStorage.getItem('lang') || 'fr';
let fontSizeMultiplier = parseFloat(localStorage.getItem('fontSize')) || 1.0;
let isHighContrast = localStorage.getItem('contrast') === 'true';
let passwordHistory = [];
let isPasswordVisible = true;

// --- FONCTIONS D'ACCESSIBILITÉ ---
function applyFontSize() {
    document.documentElement.style.fontSize = (fontSizeMultiplier * 16) + 'px';
    localStorage.setItem('fontSize', fontSizeMultiplier);
}

function applyContrast() {
    if (isHighContrast) {
        document.body.classList.add('high-contrast');
    } else {
        document.body.classList.remove('high-contrast');
    }
    // Synchronise la checkbox
    document.getElementById('contrast-toggle').checked = isHighContrast;
    localStorage.setItem('contrast', isHighContrast);
}

// Événements accessibilité
document.getElementById('font-increase').onclick = () => { if(fontSizeMultiplier < 1.4) { fontSizeMultiplier += 0.1; applyFontSize(); }};
document.getElementById('font-decrease').onclick = () => { if(fontSizeMultiplier > 0.8) { fontSizeMultiplier -= 0.1; applyFontSize(); }};
document.getElementById('contrast-toggle').onchange = (e) => { isHighContrast = e.target.checked; applyContrast(); };

// --- GESTION THÈME & TRADUCTION ---
const updateThemeIcon = (theme) => {
    document.getElementById('theme-icon').className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
};

document.getElementById('dark-mode-btn').onclick = () => {
    const newTheme = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

function updateUI() {
    const t = translations[currentLang];
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-length').innerText = t.length;
    document.getElementById('ui-lowercase').innerText = t.lowercase;
    document.getElementById('ui-uppercase').innerText = t.uppercase;
    document.getElementById('ui-numbers').innerText = t.numbers;
    document.getElementById('ui-symbols').innerText = t.symbols;
    document.getElementById('ui-ambiguous').innerText = t.ambiguous;
    document.getElementById('ui-btn-text').innerText = t.btn;
    document.getElementById('ui-history').innerText = t.history;
    document.getElementById('ui-accessibility').innerText = t.accessibility;
    document.getElementById('ui-text-size').innerText = t.textSize;
    document.getElementById('ui-contrast').innerText = t.contrast; // Traduction ajoutée ici
    document.getElementById('lang-btn').innerText = currentLang === 'fr' ? 'EN' : 'FR';
    
    const currentPass = document.getElementById('password-display').innerText;
    if (!currentPass.includes('*')) updateStrength(currentPass);
    renderHistory();
}

document.getElementById('lang-btn').onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', currentLang);
    updateUI();
};

// --- LOGIQUE GÉNÉRATEUR ---
function getTimeToCrack(p) {
    let charsetSize = 0;
    if (/[a-z]/.test(p)) charsetSize += 26;
    if (/[A-Z]/.test(p)) charsetSize += 26;
    if (/[0-9]/.test(p)) charsetSize += 10;
    if (/[^A-Za-z0-9]/.test(p)) charsetSize += 32;
    const combinations = Math.pow(charsetSize, p.length);
    const seconds = combinations / 1e10; 
    const u = translations[currentLang].units;
    if (seconds < 1) return "< 1 " + u.sec;
    if (seconds < 3600) return Math.floor(seconds / 60) + " " + u.min;
    if (seconds < 86400) return Math.floor(seconds / 3600) + " " + u.hours;
    if (seconds < 31536000) return Math.floor(seconds / 86400) + " " + u.days;
    if (seconds < 31536000000) return Math.floor(seconds / 31536000) + " " + u.years;
    return u.centuries;
}

function updateStrength(p) {
    const bar = document.getElementById('strength-bar');
    const crackDisplay = document.getElementById('crack-time-display');
    let s = p.length * 3;
    if (/[A-Z]/.test(p)) s += 20;
    if (/[0-9]/.test(p)) s += 20;
    if (/[^A-Za-z0-9]/.test(p)) s += 25;
    s = Math.min(s, 100);
    bar.style.width = s + "%";
    bar.className = "progress-bar " + (s < 45 ? "bg-danger" : s < 80 ? "bg-warning" : "bg-success");
    if (crackDisplay) crackDisplay.innerText = translations[currentLang].crack + getTimeToCrack(p);
}

function renderHistory() {
    const list = document.getElementById('history-list');
    const t = translations[currentLang];
    if (passwordHistory.length === 0) { list.innerHTML = ""; return; }
    list.innerHTML = passwordHistory.map(p => `
        <div class="history-item" onclick="navigator.clipboard.writeText('${p}')">
            <span class="text-truncate" style="max-width: 80%">${p}</span>
            <i class="bi bi-copy"></i>
        </div>
    `).join('') + `<button class="btn btn-sm btn-link text-danger mt-3 p-0" id="clear-h">${t.clear}</button>`;
    
    document.getElementById('clear-h').onclick = () => { passwordHistory = []; renderHistory(); };
}

// --- ÉVÉNEMENTS BOUTONS ---
document.getElementById('generate-btn').onclick = () => {
    const len = document.getElementById('length-slider').value;
    let pool = "";
    if (document.getElementById('lowercase').checked) pool += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById('uppercase').checked) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById('numbers').checked) pool += "0123456789";
    if (document.getElementById('symbols').checked) pool += "!@#$%^&*()_+";
    if (document.getElementById('exclude-ambiguous').checked) pool = pool.replace(/[ilLIoO01]/g, "");

    const d = document.getElementById('password-display');
    if (!pool) { d.innerText = translations[currentLang].error; d.classList.add('text-danger'); return; }

    let password = "";
    for (let i = 0; i < len; i++) password += pool.charAt(Math.floor(Math.random() * pool.length));
    
    d.innerText = password; d.classList.remove('text-danger');
    d.style.fontSize = password.length > 24 ? "1rem" : "1.25rem";
    
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: password, width: 128, height: 128 });
    passwordHistory.unshift(password); if (passwordHistory.length > 5) passwordHistory.pop();
    renderHistory(); updateStrength(password);
};

document.getElementById('visibility-toggle').onclick = () => {
    isPasswordVisible = !isPasswordVisible;
    document.getElementById('password-display').classList.toggle('password-hidden');
    const icon = document.querySelector('#visibility-toggle i');
    icon.classList.toggle('bi-eye'); icon.classList.toggle('bi-eye-slash');
};

document.getElementById('qr-toggle').onclick = () => document.getElementById('qr-container').classList.toggle('d-none');
document.getElementById('length-slider').oninput = (e) => document.getElementById('length-val').innerText = e.target.value;

document.getElementById('copy-btn').onclick = () => {
    navigator.clipboard.writeText(document.getElementById('password-display').innerText);
    const i = document.querySelector('#copy-btn i');
    i.className = 'bi bi-check-lg text-success';
    setTimeout(() => i.className = 'bi bi-clipboard', 1500);
};

// --- INITIALISATION AU CHARGEMENT ---
window.onload = () => {
    applyFontSize();
    applyContrast();
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', savedTheme);
    updateThemeIcon(savedTheme);
    updateUI();
    document.getElementById('generate-btn').click();
};

document.body.addEventListener('keydown', (e) => { if (e.key === 'Tab') document.body.classList.add('using-keyboard'); });
