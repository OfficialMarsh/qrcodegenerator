let userIP = '';

// Dil çevirileri
const translations = {
  en: {
    title: "QR Code History",
    noHistory: "No QR codes generated yet"
  },
  de: {
    title: "QR-Code Verlauf",
    noHistory: "Noch keine QR-Codes generiert"
  },
  fr: {
    title: "Historique des Codes QR",
    noHistory: "Aucun code QR généré"
  },
  it: {
    title: "Cronologia Codici QR",
    noHistory: "Nessun codice QR generato"
  },
  ru: {
    title: "История QR-кодов",
    noHistory: "QR-коды еще не созданы"
  },
  tr: {
    title: "QR Kod Geçmişi",
    noHistory: "Henüz QR kod oluşturulmadı"
  }
};

// IP adresini al
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP = data.ip;
    loadQRHistory();
  } catch (error) {
    console.error('IP alınamadı:', error);
    userIP = 'unknown';
    loadQRHistory();
  }
}

// Geçmişi yükle
function loadQRHistory() {
  const historyKey = `qr_history_${userIP}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  updateHistoryUI(history);
}

// Geçmiş UI'ını güncelle
function updateHistoryUI(history) {
  const historyContainer = document.querySelector('.qr-history');
  const currentLang = document.documentElement.lang || 'en';
  
  if (history.length === 0) {
    historyContainer.innerHTML = `
      <div class="no-history">
        <p>${translations[currentLang].noHistory}</p>
      </div>
    `;
    return;
  }

  historyContainer.innerHTML = history.map(item => `
    <div class="history-item">
      <img src="${item.imageUrl}" alt="QR Code">
      <div class="history-info">
        <div class="history-text">${item.value}</div>
        <div class="history-date">${new Date(item.date).toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

// Dil değiştirme işlevselliği
const languageBtn = document.querySelector('.language-btn');
const languageDropdown = document.querySelector('.language-dropdown');
const languageOptions = document.querySelectorAll('.language-dropdown a');

languageBtn.addEventListener('click', () => {
  languageDropdown.classList.toggle('show');
});

document.addEventListener('click', (e) => {
  if (!languageBtn.contains(e.target)) {
    languageDropdown.classList.remove('show');
  }
});

languageOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    changeLang(lang);
  });
});

function changeLang(lang) {
  document.documentElement.lang = lang;
  document.querySelector('.history-page-title').textContent = translations[lang].title;
  loadQRHistory(); // Geçmişi yeni dilde güncelle
  localStorage.setItem('preferredLanguage', lang);
}

// Sayfa yüklendiğinde
document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
  changeLang(preferredLanguage);
  getUserIP();
}); 