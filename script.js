const translations = {
    fr: { 
        title: "Générateur Pro", length: "Longueur", lowercase: "Minuscules (abc)",
        uppercase: "Majuscules (ABC)", numbers: "Chiffres (0-9)", symbols: "Symboles (@#$!)",
        ambiguous: "Exclure ambigus", btn: "Générer", error: "Option requise"
    },
    en: { 
        title: "Pro Generator", length: "Length", lowercase: "Lowercase (abc)",
        uppercase: "Uppercase (ABC)", numbers: "Numbers (0-9)", symbols: "Symbols (@#$!)",
        ambiguous: "Exclude ambiguous", btn: "Generate", error: "Option required"
    }
};

let currentLang = 'fr';

// --- MODE SOMBRE ---
const themeBtn = document.getElementById('dark-mode-btn');
const themeIcon = document.getElementById('theme-icon');

themeBtn.onclick = () => {
    const isDark = document.documentElement.getAttribute('data-bs-theme') === 'dark';
    const newTheme = isDark ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', newTheme);
    themeIcon.className = isDark ? 'bi bi-moon-stars' : 'bi bi-sun';
    localStorage.setItem('theme', newTheme);
};

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-bs-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';

// --- TRADUCTION ---
document.getElementById('lang-btn').onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    const t = translations[currentLang];
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-length').innerText = t.length;
    document.getElementById('ui-lowercase').innerText = t.lowercase;
    document.getElementById('ui-uppercase').innerText = t.uppercase;
    document.getElementById('ui-numbers').innerText = t.numbers;
    document.getElementById('ui-symbols').innerText = t.symbols;
    document.getElementById('ui-ambiguous').innerText = t.ambiguous;
    document.getElementById('ui-btn-text').innerText = t.btn;
    document.getElementById('lang-btn').innerText = currentLang === 'fr' ? 'EN' : 'FR';
};

// --- FORCE DU MOT DE PASSE ---
function updateStrengthBar(pass) {
    const bar = document.getElementById('strength-bar');
    let score = 0;
    if (pass.length >= 8) score += 25;
    if (pass.length >= 16) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 20;
    if (/[0-9]/.test(pass)) score += 15;
    if (/[^A-Za-z0-9]/.test(pass)) score += 15;

    bar.style.width = score + "%";
    bar.className = "progress-bar ";
    if (score < 40) bar.classList.add('bg-danger');
    else if (score < 80) bar.classList.add('bg-warning');
    else bar.classList.add('bg-success');
}

// --- GÉNÉRATEUR ---
const slider = document.getElementById('length-slider');
const display = document.getElementById('password-display');
slider.oninput = () => document.getElementById('length-val').innerText = slider.value;

document.getElementById('generate-btn').onclick = () => {
    let pool = "";
    if (document.getElementById('lowercase').checked) pool += "abcdefghijklmnopqrstuvwxyz";
    if (document.getElementById('uppercase').checked) pool += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (document.getElementById('numbers').checked) pool += "0123456789";
    if (document.getElementById('symbols').checked) pool += "!@#$%^&*()_+";

    if (document.getElementById('exclude-ambiguous').checked) {
        pool = pool.replace(/[ilLIoO01]/g, "");
    }

    if (pool === "") {
        display.innerText = translations[currentLang].error;
        display.classList.add('text-danger');
        display.style.fontSize = "1.1rem";
        document.getElementById('strength-bar').style.width = "0%";
        return;
    }

    display.classList.remove('text-danger');
    let password = "";
    for (let i = 0; i < slider.value; i++) {
        password += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    // AJUSTEMENT DYNAMIQUE DE LA TAILLE
    if (password.length > 24) {
        display.style.fontSize = "0.9rem";
    } else if (password.length > 18) {
        display.style.fontSize = "1.05rem";
    } else {
        display.style.fontSize = "1.25rem";
    }

    display.innerText = password;
    updateStrengthBar(password);
};

// --- COPIE ---
document.getElementById('copy-btn').onclick = () => {
    const text = display.innerText;
    if (text.includes('*') || text.length > 50) return;
    navigator.clipboard.writeText(text).then(() => {
        const icon = document.querySelector('#copy-btn i');
        icon.classList.replace('bi-clipboard', 'bi-check-lg');
        setTimeout(() => icon.classList.replace('bi-check-lg', 'bi-clipboard'), 1500);
    });
};