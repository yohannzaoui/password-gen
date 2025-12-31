const translations = {
    fr: { 
        title: "Password GEN", length: "Longueur", lowercase: "Minuscules (abc)",
        uppercase: "Majuscules (ABC)", numbers: "Chiffres (0-9)", symbols: "Symboles (@#$!)",
        ambiguous: "Exclure ambigus (i, l, 1, 0, o)", btn: "Générer", history: "Historique", 
        error: "Option requise", clear: "Vider l'historique", crack: "Temps pour craquer : ",
        units: { sec: "sec", min: "min", hours: "heures", days: "jours", years: "ans", centuries: "Siècles 🛡️" }
    },
    en: { 
        title: "Password GEN", length: "Length", lowercase: "Lowercase (abc)",
        uppercase: "Uppercase (ABC)", numbers: "Numbers (0-9)", symbols: "Symbols (@#$!)",
        ambiguous: "Exclude Ambiguous (i, l, 1, 0, o)", btn: "Generate", history: "History", 
        error: "Option required", clear: "Clear History", crack: "Time to crack: ",
        units: { sec: "sec", min: "min", hours: "hours", days: "days", years: "years", centuries: "Centuries 🛡️" }
    }
};

// --- ÉTAT & PRÉFÉRENCES ---
let currentLang = localStorage.getItem('lang') || 'fr';
let passwordHistory = [];
let isPasswordVisible = true;

// --- GESTION DU THÈME ---
const themeBtn = document.getElementById('dark-mode-btn');
const themeIcon = document.getElementById('theme-icon');

const updateThemeIcon = (theme) => {
    themeIcon.className = theme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
};

themeBtn.onclick = () => {
    const currentTheme = document.documentElement.getAttribute('data-bs-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
};

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);
updateThemeIcon(savedTheme);

// --- GESTION TRADUCTION ---
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
    document.getElementById('lang-btn').innerText = currentLang === 'fr' ? 'EN' : 'FR';
    
    // Rafraîchir le temps de craquage traduit
    const currentPass = document.getElementById('password-display').innerText;
    if (!currentPass.includes('*')) {
        updateStrength(currentPass);
    }
    renderHistory();
}

document.getElementById('lang-btn').onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    localStorage.setItem('lang', currentLang);
    updateUI();
};

// --- LOGIQUE CORE ---
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

function renderHistory() {
    const list = document.getElementById('history-list');
    const t = translations[currentLang];
    
    if (passwordHistory.length === 0) {
        list.innerHTML = "";
        return;
    }

    let html = passwordHistory.map(p => `
        <div class="history-item" onclick="navigator.clipboard.writeText('${p}')">
            <span class="text-truncate" style="max-width: 80%">${p}</span>
            <i class="bi bi-copy"></i>
        </div>
    `).join('');

    html += `<button class="btn btn-sm btn-link text-danger mt-3 p-0 text-decoration-none" id="clear-history">
                <i class="bi bi-trash3 me-1"></i>${t.clear}
             </button>`;
    
    list.innerHTML = html;

    const clearBtn = document.getElementById('clear-history');
    if(clearBtn) {
        clearBtn.onclick = () => {
            passwordHistory = [];
            renderHistory();
        };
    }
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
    
    if (crackDisplay) {
        crackDisplay.innerText = translations[currentLang].crack + getTimeToCrack(p);
    }
}

const slider = document.getElementById('length-slider');
const display = document.getElementById('password-display');
slider.oninput = () => document.getElementById('length-val').innerText = slider.value;

document.getElementById('generate-btn').onclick = () => {
    const len = slider.value;
    let pool = "";
    if (document.getElementById('lowercase').checked) pool += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById('uppercase').checked) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById('numbers').checked) pool += "0123456789";
    if (document.getElementById('symbols').checked) pool += "!@#$%^&*()_+";

    if (document.getElementById('exclude-ambiguous').checked) {
        pool = pool.replace(/[ilLIoO01]/g, "");
    }

    if (!pool) {
        display.innerText = translations[currentLang].error;
        display.classList.add('text-danger');
        return;
    }

    display.classList.remove('text-danger');
    let password = "";
    for (let i = 0; i < len; i++) {
        password += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    display.innerText = password;
    display.style.fontSize = password.length > 24 ? "0.9rem" : (password.length > 18 ? "1.1rem" : "1.25rem");
    
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: password, width: 128, height: 128 });

    passwordHistory.unshift(password);
    if (passwordHistory.length > 5) passwordHistory.pop();
    renderHistory();
    updateStrength(password);
};

// Toggle Visibilité
document.getElementById('visibility-toggle').onclick = () => {
    isPasswordVisible = !isPasswordVisible;
    const icon = document.querySelector('#visibility-toggle i');
    if (isPasswordVisible) {
        display.classList.remove('password-hidden');
        icon.classList.replace('bi-eye-slash', 'bi-eye');
    } else {
        display.classList.add('password-hidden');
        icon.classList.replace('bi-eye', 'bi-eye-slash');
    }
};

document.getElementById('qr-toggle').onclick = () => document.getElementById('qr-container').classList.toggle('d-none');

document.getElementById('copy-btn').onclick = () => {
    if (display.innerText.includes('*')) return;
    navigator.clipboard.writeText(display.innerText).then(() => {
        const icon = document.querySelector('#copy-btn i');
        icon.classList.replace('bi-clipboard', 'bi-check-lg');
        setTimeout(() => icon.classList.replace('bi-check-lg', 'bi-clipboard'), 1500);
    });
};

window.onload = () => {
    updateUI(); 
    document.getElementById('generate-btn').click();
};