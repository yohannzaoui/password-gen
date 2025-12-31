const translations = {
    fr: { 
        title: "Générateur Pro", length: "Longueur", lowercase: "Minuscules (abc)",
        uppercase: "Majuscules (ABC)", numbers: "Chiffres (0-9)", 
        symbols: "Symboles (@#$!)", ambiguous: "Exclure ambigus (i, L, 0...)",
        btn: "Générer", alert: "Copié !", error: "Choisir une option" 
    },
    en: { 
        title: "Pro Generator", length: "Length", lowercase: "Lowercase (abc)",
        uppercase: "Uppercase (ABC)", numbers: "Numbers (0-9)", 
        symbols: "Symbols (@#$!)", ambiguous: "Exclude ambiguous",
        btn: "Generate", alert: "Copied!", error: "Select an option" 
    }
};

let currentLang = 'fr';

function translateApp() {
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
}

document.getElementById('lang-btn').onclick = () => {
    currentLang = currentLang === 'fr' ? 'en' : 'fr';
    translateApp();
};

document.getElementById('dark-mode-btn').onclick = () => {
    document.body.classList.toggle('dark-mode');
    const icon = document.getElementById('theme-icon');
    icon.classList.toggle('bi-moon-stars');
    icon.classList.toggle('bi-sun');
};

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
        display.style.color = "red";
        return;
    }

    let password = "";
    for (let i = 0; i < slider.value; i++) {
        password += pool.charAt(Math.floor(Math.random() * pool.length));
    }
    
    display.innerText = password;
    display.style.color = "var(--accent)";
};

document.getElementById('copy-btn').onclick = () => {
    if (display.innerText.includes('*') || display.innerText.includes(' ')) return;
    navigator.clipboard.writeText(display.innerText);
    const icon = document.querySelector('#copy-btn i');
    icon.classList.replace('bi-clipboard', 'bi-check-lg');
    setTimeout(() => icon.classList.replace('bi-check-lg', 'bi-clipboard'), 1500);
};