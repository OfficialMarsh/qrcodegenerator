const languageBtn = document.querySelector('.language-btn');
const languageDropdown = document.querySelector('.language-dropdown');
const languageOptions = document.querySelectorAll('.language-dropdown a');

// Dil çevirileri
const translations = {
  en: {
    title: "QR Code Generator",
    description: "Paste a url or enter text to create QR code",
    buttonText: "Generate QR Code",
    generating: "Generating QR Code...",
    placeholder: "Enter text or url"
  },
  de: {
    title: "QR-Code Generator",
    description: "Fügen Sie eine URL ein oder geben Sie Text ein, um einen QR-Code zu erstellen",
    buttonText: "QR-Code generieren",
    generating: "QR-Code wird generiert...",
    placeholder: "Text oder URL eingeben"
  },
  fr: {
    title: "Générateur de Code QR",
    description: "Collez une URL ou entrez du texte pour créer un code QR",
    buttonText: "Générer le Code QR",
    generating: "Génération du Code QR...",
    placeholder: "Entrez le texte ou l'URL"
  },
  it: {
    title: "Generatore di Codici QR",
    description: "Incolla un URL o inserisci il testo per creare il codice QR",
    buttonText: "Genera Codice QR",
    generating: "Generazione del Codice QR...",
    placeholder: "Inserisci testo o URL"
  },
  ru: {
    title: "Генератор QR-кода",
    description: "Вставьте URL или введите текст для создания QR-кода",
    buttonText: "Создать QR-код",
    generating: "Создание QR-кода...",
    placeholder: "Введите текст или URL"
  },
  tr: {
    title: "QR Kod Oluşturucu",
    description: "QR kod oluşturmak için URL yapıştırın veya metin girin",
    buttonText: "QR Kod Oluştur",
    generating: "QR Kod Oluşturuluyor...",
    placeholder: "Metin veya URL girin"
  }
};

// Dil butonuna tıklama olayı
languageBtn.addEventListener('click', () => {
  languageDropdown.classList.toggle('show');
});

// Sayfa herhangi bir yerine tıklandığında dropdown'ı kapat
document.addEventListener('click', (e) => {
  if (!languageBtn.contains(e.target)) {
    languageDropdown.classList.remove('show');
  }
});

// Dil seçeneklerine tıklama olayı
languageOptions.forEach(option => {
  option.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = e.target.dataset.lang;
    changeLang(lang);
  });
});

// Dil değiştirme fonksiyonu
function changeLang(lang) {
  document.documentElement.lang = lang;
  const t = translations[lang];
  
  document.querySelector('header h1').textContent = t.title;
  document.querySelector('header p').textContent = t.description;
  document.querySelector('.form input').placeholder = t.placeholder;
  generateBtn.textContent = t.buttonText;
  
  // Dil tercihini localStorage'a kaydet
  localStorage.setItem('preferredLanguage', lang);
}

// Sayfa yüklendiğinde tercih edilen dili kontrol et
document.addEventListener('DOMContentLoaded', () => {
  const preferredLanguage = localStorage.getItem('preferredLanguage') || 'en';
  changeLang(preferredLanguage);
}); 