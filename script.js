const translations = {
    fr: { 
        title: "Password GEN", length: "Longueur / Mots", lowercase: "Minuscules (abc)", uppercase: "Majuscules (ABC)",
        numbers: "Chiffres (123)", symbols: "Symboles (@#$)", btn: "Générer", history: "Historique", 
        clear: "Vider l'historique", crack: "Temps pour craquer : ", accessibility: "Accessibilité", 
        textSize: "Taille du texte", contrast: "Contraste élevé", modeP: "Mot de passe", modePh: "Passphrase",
        units: { years: "ans", hours: "heures", centuries: "Siècles 🛡️", days: "jrs" }
    },
    en: { 
        title: "Password GEN", length: "Length / Words", lowercase: "Lowercase (abc)", uppercase: "Uppercase (ABC)",
        numbers: "Numbers (123)", symbols: "Symbols (@#$)", btn: "Generate", history: "History", 
        clear: "Clear History", crack: "Time to crack: ", accessibility: "Accessibility", 
        textSize: "Text Size", contrast: "High Contrast", modeP: "Password", modePh: "Passphrase",
        units: { years: "years", hours: "hours", centuries: "Centuries 🛡️", days: "days" }
    }
};

let currentLang = localStorage.getItem('lang') || 'fr';
let fontSizeMultiplier = parseFloat(localStorage.getItem('fontSize')) || 1.0;
let isHighContrast = localStorage.getItem('contrast') === 'true';
let passwordHistory = [];

function applyFontSize() {
    document.documentElement.style.fontSize = (fontSizeMultiplier * 16) + 'px';
    localStorage.setItem('fontSize', fontSizeMultiplier);
}

function applyContrast() {
    isHighContrast ? document.body.classList.add('high-contrast') : document.body.classList.remove('high-contrast');
    document.getElementById('contrast-toggle').checked = isHighContrast;
    localStorage.setItem('contrast', isHighContrast);
}

function updateUI() {
    const t = translations[currentLang];
    const ids = ['title', 'length', 'lowercase', 'uppercase', 'numbers', 'symbols', 'history', 'accessibility', 'textSize', 'contrast'];
    ids.forEach(id => { 
        const el = document.getElementById(`ui-${id}`);
        if (el) el.innerText = t[id]; 
    });
    document.getElementById('ui-btn-text').innerText = t.btn;
    document.getElementById('ui-mode-p').innerText = t.modeP;
    document.getElementById('ui-mode-ph').innerText = t.modePh;
    document.getElementById('lang-btn').innerText = currentLang === 'fr' ? 'EN' : 'FR';
    
    const currentPass = document.getElementById('password-display').innerText;
    if(currentPass !== "********") updateStrength(currentPass);
    renderHistory();
}

function generate() {
    const isPassphrase = document.getElementById('mode-passphrase').checked;
    const len = parseInt(document.getElementById('length-slider').value);
    const useLower = document.getElementById('lowercase').checked;
    const useUpper = document.getElementById('uppercase').checked;
    const useNumbers = document.getElementById('numbers').checked;
    const useSymbols = document.getElementById('symbols').checked;
    let result = "";

    if (isPassphrase) {
        const nbBlocks = 4;
        const blockSize = Math.max(Math.floor(len / nbBlocks), 3);
        let blocks = [];
        let hasLetters = useLower || useUpper;
        for (let i = 0; i < nbBlocks; i++) {
            if (hasLetters) {
                let word = "";
                const v = "aeiouy", c = "bcdfghjklmnpqrstvwxz";
                for (let j = 0; j < blockSize; j++) word += (j % 2 === 0) ? c[Math.floor(Math.random() * c.length)] : v[Math.floor(Math.random() * v.length)];
                if (useUpper && !useLower) word = word.toUpperCase();
                else if (useUpper && useLower && i === 0) word = word.charAt(0).toUpperCase() + word.slice(1);
                blocks.push(word);
            } else {
                let pool = (useNumbers ? "0123456789" : "") + (useSymbols ? "!@#$%^&*()_+" : "");
                let block = "";
                for (let j = 0; j < blockSize; j++) block += pool[Math.floor(Math.random() * pool.length)];
                blocks.push(block);
            }
        }
        const sep = useSymbols && (hasLetters || useNumbers) ? "@" : "-";
        result = blocks.join(sep);
        if (hasLetters && useNumbers) result += Math.floor(Math.random() * 10);
    } else {
        let pool = (useLower ? "abcdefghijklmnopqrstuvwxyz" : "") + (useUpper ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ" : "") + (useNumbers ? "0123456789" : "") + (useSymbols ? "!@#$%^&*()_+" : "");
        if (!pool) return;
        for (let i = 0; i < len; i++) result += pool.charAt(Math.floor(Math.random() * pool.length));
    }

    document.getElementById('password-display').innerText = result;
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), { text: result, width: 128, height: 128 });
    passwordHistory.unshift(result); if (passwordHistory.length > 10) passwordHistory.pop();
    renderHistory();
    updateStrength(result);
}

function updateStrength(p) {
    const bar = document.getElementById('strength-bar');
    const t = translations[currentLang];
    let poolSize = 0;
    if (/[a-z]/.test(p)) poolSize += 26;
    if (/[A-Z]/.test(p)) poolSize += 26;
    if (/[0-9]/.test(p)) poolSize += 10;
    if (/[^a-zA-Z0-9]/.test(p)) poolSize += 32;

    const entropy = p.length * Math.log2(poolSize || 1);
    let strengthPercent = Math.min((entropy / 128) * 100, 100);
    bar.style.width = strengthPercent + "%";
    
    if (entropy < 45) bar.className = "progress-bar bg-danger";
    else if (entropy < 80) bar.className = "progress-bar bg-warning";
    else bar.className = "progress-bar bg-success";

    const secondsToCrack = Math.pow(poolSize || 1, p.length) / 1e11; 
    let displayTime = "";
    if (secondsToCrack < 1) displayTime = "< 1 sec";
    else if (secondsToCrack < 3600) displayTime = `~${Math.round(secondsToCrack / 60)} min`;
    else if (secondsToCrack < 86400) displayTime = `~${Math.round(secondsToCrack / 3600)} ${t.units.hours}`;
    else if (secondsToCrack < 31536000) displayTime = `~${Math.round(secondsToCrack / 86400)} ${t.units.days}`;
    else if (secondsToCrack < 3153600000) displayTime = `~${Math.round(secondsToCrack / 31536000)} ${t.units.years}`;
    else displayTime = `100+ ${t.units.centuries}`;

    document.getElementById('crack-time-display').innerText = t.crack + displayTime;
}

document.getElementById('generate-btn').onclick = generate;
document.getElementById('copy-btn').onclick = () => {
    const text = document.getElementById('password-display').innerText;
    const icon = document.getElementById('copy-icon');
    navigator.clipboard.writeText(text).then(() => {
        icon.className = 'bi bi-check-lg ' + (isHighContrast ? '' : 'text-success');
        setTimeout(() => icon.className = 'bi bi-clipboard', 2000);
    });
};

document.getElementById('download-btn').onclick = () => {
    if (!passwordHistory.length) return;
    const content = `HISTORIQUE - ${new Date().toLocaleString()}\n\n` + passwordHistory.map((p, i) => `${i+1}. ${p}`).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([content], {type: 'text/plain'}));
    a.download = 'passwords.txt';
    a.click();
};

document.getElementById('visibility-toggle').onclick = () => {
    const display = document.getElementById('password-display'), icon = document.getElementById('eye-icon');
    display.classList.toggle('password-hidden');
    icon.classList.toggle('bi-eye'); icon.classList.toggle('bi-eye-slash');
};

document.getElementById('lang-btn').onclick = () => { 
    currentLang = currentLang === 'fr' ? 'en' : 'fr'; 
    localStorage.setItem('lang', currentLang); updateUI(); 
};

document.getElementById('dark-mode-btn').onclick = () => {
    const t = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-bs-theme', t);
    localStorage.setItem('theme', t);
    document.getElementById('theme-icon').className = t === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
};

document.getElementById('font-increase').onclick = () => { if(fontSizeMultiplier < 1.4) { fontSizeMultiplier += 0.1; applyFontSize(); }};
document.getElementById('font-decrease').onclick = () => { if(fontSizeMultiplier > 0.8) { fontSizeMultiplier -= 0.1; applyFontSize(); }};
document.getElementById('contrast-toggle').onchange = (e) => { isHighContrast = e.target.checked; applyContrast(); };

function renderHistory() {
    const list = document.getElementById('history-list');
    if (!list) return;
    if (!passwordHistory.length) { list.innerHTML = ""; return; }
    list.innerHTML = passwordHistory.map(p => `
        <div class="history-item" onclick="navigator.clipboard.writeText('${p}')">
            <span class="password-text">${p}</span>
            <i class="bi bi-copy ms-2"></i>
        </div>
    `).join('') + 
    `<button class="btn btn-sm btn-link text-danger mt-2 p-0" id="clear-h"><i class="bi bi-trash"></i> ${translations[currentLang].clear}</button>`;
    document.getElementById('clear-h').onclick = () => { passwordHistory = []; renderHistory(); };
}

function savePreference(key, value) {
    localStorage.setItem(key, value);
    
    // Envoyer la préférence à Google Analytics
    if (typeof gtag === 'function') {
        gtag('event', 'user_preference_change', {
            'preference_type': key,
            'preference_value': value
        });
    }

    if (key === 'user_theme') {
        document.body.className = value;
    }
}

document.getElementById('qr-toggle').onclick = () => document.getElementById('qr-container').classList.toggle('d-none');
document.getElementById('length-slider').oninput = (e) => document.getElementById('length-val').innerText = e.target.value;

window.onload = () => {
    applyFontSize(); applyContrast();
    const st = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', st);
    document.getElementById('theme-icon').className = st === 'dark' ? 'bi bi-sun' : 'bi bi-moon-stars';
    updateUI(); generate();
};