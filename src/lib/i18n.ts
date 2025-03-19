import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      // Auth
      "login": "Sign in",
      "register": "Create account",
      "email": "Email address",
      "password": "Password",
      "name": "Full name",
      "age": "Age",
      "gender": "Gender",
      "location": "Location",
      
      // Profile
      "profile": "Profile",
      "height": "Height",
      "bodyType": "Body Type",
      "occupation": "Occupation",
      "hobbies": "Hobbies",
      "interests": "Interests",
      "photos": "Photos",
      "about": "About",
      
      // Navigation
      "home": "Home",
      "matches": "Matches",
      "messages": "Messages",
      
      // Actions
      "save": "Save",
      "cancel": "Cancel",
      "next": "Next",
      "back": "Back",
      "send": "Send",
      
      // Messages
      "typeMessage": "Type a message...",
      "uploadPhoto": "Upload photo",
      
      // Settings
      "settings": "Settings",
      "language": "Language",
      "theme": "Theme",
      "darkMode": "Dark mode",
      "lightMode": "Light mode",
    }
  },
  tr: {
    translation: {
      // Auth
      "login": "Giriş yap",
      "register": "Hesap oluştur",
      "email": "E-posta adresi",
      "password": "Şifre",
      "name": "Ad Soyad",
      "age": "Yaş",
      "gender": "Cinsiyet",
      "location": "Konum",
      
      // Profile
      "profile": "Profil",
      "height": "Boy",
      "bodyType": "Vücut Tipi",
      "occupation": "Meslek",
      "hobbies": "Hobiler",
      "interests": "İlgi Alanları",
      "photos": "Fotoğraflar",
      "about": "Hakkında",
      
      // Navigation
      "home": "Ana Sayfa",
      "matches": "Eşleşmeler",
      "messages": "Mesajlar",
      
      // Actions
      "save": "Kaydet",
      "cancel": "İptal",
      "next": "İleri",
      "back": "Geri",
      "send": "Gönder",
      
      // Messages
      "typeMessage": "Mesaj yazın...",
      "uploadPhoto": "Fotoğraf yükle",
      
      // Settings
      "settings": "Ayarlar",
      "language": "Dil",
      "theme": "Tema",
      "darkMode": "Karanlık mod",
      "lightMode": "Aydınlık mod",
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;