const wrapper = document.querySelector(".wrapper"),
  qrInput = wrapper.querySelector(".form input"),
  generateBtn = wrapper.querySelector(".form button"),
  qrImg = wrapper.querySelector(".qr-code img");
let preValue;

const languageBtn = document.querySelector('.language-btn');
const languageDropdown = document.querySelector('.language-dropdown');
const languageOptions = document.querySelectorAll('.language-dropdown a');

// Dil çevirileri
const translations = {
  en: {
    title: "QR Code Generator",
    description: "Paste a url or enter text to create QR code",
    buttonText: "Generate QR Code",
    generating: "Generating QR Code..."
  },
  de: {
    title: "QR-Code Generator",
    description: "Fügen Sie eine URL ein oder geben Sie Text ein, um einen QR-Code zu erstellen",
    buttonText: "QR-Code generieren",
    generating: "QR-Code wird generiert..."
  },
  fr: {
    title: "Générateur de Code QR",
    description: "Collez une URL ou entrez du texte pour créer un code QR",
    buttonText: "Générer le Code QR",
    generating: "Génération du Code QR..."
  },
  it: {
    title: "Generatore di Codici QR",
    description: "Incolla un URL o inserisci il testo per creare il codice QR",
    buttonText: "Genera Codice QR",
    generating: "Generazione del Codice QR..."
  },
  ru: {
    title: "Генератор QR-кода",
    description: "Вставьте URL или введите текст для создания QR-кода",
    buttonText: "Создать QR-код",
    generating: "Создание QR-кода..."
  },
  tr: {
    title: "QR Kod Oluşturucu",
    description: "QR kod oluşturmak için URL yapıştırın veya metin girin",
    buttonText: "QR Kod Oluştur",
    generating: "QR Kod Oluşturuluyor..."
  }
};

// Dil butonuna tıklama olayı
languageBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  languageDropdown.classList.toggle('show');
});

// Sayfa herhangi bir yerine tıklandığında dropdown'ı kapat
document.addEventListener('click', () => {
  languageDropdown.classList.remove('show');
});

// Dil seçeneklerine tıklama olayı
languageOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    changeLang(lang);
    languageDropdown.classList.remove('show');
  });
});

// Dil değiştirme fonksiyonu
function changeLang(lang) {
  document.documentElement.lang = lang;
  const t = translations[lang];
  
  document.querySelector('header h1').textContent = t.title;
  document.querySelector('header p').textContent = t.description;
  generateBtn.textContent = t.buttonText;
  
  localStorage.setItem('preferredLanguage', lang);
}

// Sayfa yüklendiğinde tercih edilen dili kontrol et
document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
  changeLang(preferredLanguage);
});

let userIP = '';

// IP adresini al
async function getUserIP() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    userIP = data.ip;
    loadQRHistory(); // IP alındıktan sonra geçmişi yükle
  } catch (error) {
    console.error('IP alınamadı:', error);
    userIP = 'unknown'; // Hata durumunda varsayılan değer
  }
}

// QR geçmişini sakla
function saveToHistory(qrValue, qrImageUrl) {
  const historyKey = `qr_history_${userIP}`;
  let history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  
  // Yeni QR kodu ekle
  const newQR = {
    value: qrValue,
    imageUrl: qrImageUrl,
    date: new Date().toISOString()
  };
  
  // Geçmişin başına ekle (en son oluşturulan en üstte)
  history.unshift(newQR);
  
  // Maksimum 10 kayıt tut
  if (history.length > 10) {
    history = history.slice(0, 10);
  }
  
  localStorage.setItem(historyKey, JSON.stringify(history));
  updateHistoryUI();
}

// Geçmişi yükle ve göster
function loadQRHistory() {
  const historyKey = `qr_history_${userIP}`;
  const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  updateHistoryUI(history);
}

// Geçmiş UI'ını güncelle
function updateHistoryUI(history = null) {
  if (!history) {
    const historyKey = `qr_history_${userIP}`;
    history = JSON.parse(localStorage.getItem(historyKey) || '[]');
  }
  
  const historyContainer = document.querySelector('.qr-history');
  if (!historyContainer) return;
  
  historyContainer.innerHTML = history.map(item => `
    <div class="history-item">
      <img src="${item.imageUrl}" alt="QR Code" width="50">
      <div class="history-info">
        <div class="history-text">${item.value}</div>
        <div class="history-date">${new Date(item.date).toLocaleString()}</div>
      </div>
    </div>
  `).join('');
}

// QR kod oluşturma fonksiyonunu güncelle
generateBtn.addEventListener("click", () => {
  let qrValue = qrInput.value.trim();
  if (!qrValue || preValue === qrValue) return;
  preValue = qrValue;
  generateBtn.innerText = translations[document.documentElement.lang].generating;
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrValue)}`;
  qrImg.src = qrImageUrl;
  qrImg.addEventListener("load", () => {
    wrapper.classList.add("active");
    generateBtn.innerText = translations[document.documentElement.lang].buttonText;
    // Geçmişe kaydet
    saveToHistory(qrValue, qrImageUrl);
  });
});

qrInput.addEventListener("keyup", () => {
  if (!qrInput.value.trim()) {
    wrapper.classList.remove("active");
    preValue = "";
  }
});

function generatePassword() {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
  let password = "";
  const passwordLength = 16; // Password length

  for (let i = 0; i < passwordLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
  }

  // Set the generated password in the input field
  document.getElementById("password").value = password;
}

// Sayfa yüklendiğinde IP al ve geçmişi göster
document.addEventListener('DOMContentLoaded', () => {
  getUserIP();
  // ... mevcut DOMContentLoaded kodları ...
});
