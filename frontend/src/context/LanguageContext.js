import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Header
    home: 'Home',
    store: 'Store',
    about: 'About',
    contact: 'Contact',
    discounts: 'Discounts',
    newCollection: 'New Collection',
    searchPlaceholder: 'Search...',
    
    // Homepage
    heroTitle: 'Te Ipsum',
    heroSubtitle: 'Vestments for the Inner Dialogue',
    discoverProducts: 'Discover products',
    shopNowButton: 'Shop Now',
    aboutOurShop: 'About our shop',
    thoughtfulClothing: 'Thoughtful clothing for the inner dialogue.',
    minimalSymbolic: 'Minimal, symbolic, and made for self-expression.',
    
    // About Page
    aboutTitle: 'About Us - Our Sustainable Fashion Story',
    ourStory: 'Our Story',
    thePhilosophy: 'The Philosophy',
    sustainability: 'Sustainability',
    community: 'Community',
    futureVision: 'Future Vision',
    
    // Contact Page
    contactTitle: 'Contact Us - Get in Touch',
    getInTouch: 'Get in Touch',
    contactSubtitle: "We'd love to hear from you! Send us a message and we'll respond as soon as possible.",
    ourStoreLocations: 'Our Store Locations',
    searchStores: 'Search for store locations...',
    name: 'Name',
    email: 'Email',
    message: 'Message',
    sendMessage: 'Send Message',
    sending: 'Sending...',
    
    // Store Page
    storeTitle: 'Store - TeIpsum',
    gridView: 'Grid View',
    listView: 'List View',
    sortByName: 'Sort by Name',
    sortByPrice: 'Sort by Price',
    sortByRating: 'Sort by Rating',
    sortByNewest: 'Sort by Newest',
    productsFound: 'products found',
    noProductsFound: 'No products found',
    tryAdjustingFilters: 'Try adjusting your filters or search terms to find what you\'re looking for.',
    
    // Blog Page
    blogTitle: 'Fashion Blog - Trends, Tips & Sustainability',
    allPosts: 'All Posts',
    fashion: 'Fashion',
    styleTips: 'Style Tips',
    companyNews: 'Company News',
    trends: 'Trends',
    readMore: 'Read More',
    loadMoreArticles: 'Load More Articles',
    
    // Footer
    shippingInfo: 'Shipping Info',
    returnsExchanges: 'Returns & Exchanges',
    newArrivals: 'New Arrivals',
    cookiePolicy: 'Cookie Policy',
    faq: 'FAQ',
    bestsellers: 'Bestsellers',
    sizeGuide: 'Size Guide',
    sustainabilityFooter: 'Sustainability',
    accessibility: 'Accessibility',
    privacyPolicy: 'Privacy Policy',
    termsOfService: 'Terms of Service',
    careers: 'Careers',
    blog: 'Blog',
    language: 'Language',
    theme: 'Theme',
    lightTheme: 'Light Theme',
    darkTheme: 'Dark Theme',
    customerService: 'Customer Service',
    company: 'Company',
    newsletter: 'Newsletter',
    stayUpdated: 'Stay updated with our latest collections and exclusive offers.',
    emailPlaceholder: 'Enter your email address',
    subscribe: 'Subscribe',
    allRightsReserved: 'All rights reserved',
    allProducts: 'All Products',
    
    // Common
    loading: 'Loading...',
    error: 'Error',
    previous: 'Previous',
    next: 'Next',
    page: 'Page',
    of: 'of',
    close: 'Close',
    open: 'Open',
    save: 'Save',
    cancel: 'Cancel',
  },
  
  de: {
    // Header
    home: 'Startseite',
    store: 'Shop',
    about: 'Über uns',
    contact: 'Kontakt',
    discounts: 'Rabatte',
    newCollection: 'Neue Kollektion',
    searchPlaceholder: 'Suchen...',
    
    // Homepage
    heroTitle: 'Te Ipsum',
    heroSubtitle: 'Kleidung für den inneren Dialog',
    discoverProducts: 'Produkte entdecken',
    shopNowButton: 'Jetzt einkaufen',
    aboutOurShop: 'Über unseren Shop',
    thoughtfulClothing: 'Durchdachte Kleidung für den inneren Dialog.',
    minimalSymbolic: 'Minimal, symbolisch und für Selbstausdruck gemacht.',
    
    // About Page
    aboutTitle: 'Über uns - Unsere nachhaltige Mode-Geschichte',
    ourStory: 'Unsere Geschichte',
    thePhilosophy: 'Die Philosophie',
    sustainability: 'Nachhaltigkeit',
    community: 'Gemeinschaft',
    futureVision: 'Zukunftsvision',
    
    // Contact Page
    contactTitle: 'Kontakt - In Verbindung treten',
    getInTouch: 'Kontakt aufnehmen',
    contactSubtitle: 'Wir würden gerne von Ihnen hören! Senden Sie uns eine Nachricht und wir antworten so schnell wie möglich.',
    ourStoreLocations: 'Unsere Filialen',
    searchStores: 'Nach Filialen suchen...',
    name: 'Name',
    email: 'E-Mail',
    message: 'Nachricht',
    sendMessage: 'Nachricht senden',
    sending: 'Wird gesendet...',
    
    // Store Page
    storeTitle: 'Shop - TeIpsum',
    gridView: 'Rasteransicht',
    listView: 'Listenansicht',
    sortByName: 'Nach Name sortieren',
    sortByPrice: 'Nach Preis sortieren',
    sortByRating: 'Nach Bewertung sortieren',
    sortByNewest: 'Nach Neueste sortieren',
    productsFound: 'Produkte gefunden',
    noProductsFound: 'Keine Produkte gefunden',
    tryAdjustingFilters: 'Versuchen Sie, Ihre Filter oder Suchbegriffe anzupassen.',
    
    // Blog Page
    blogTitle: 'Mode-Blog - Trends, Tipps & Nachhaltigkeit',
    allPosts: 'Alle Beiträge',
    fashion: 'Mode',
    styleTips: 'Style-Tipps',
    companyNews: 'Unternehmensnews',
    trends: 'Trends',
    readMore: 'Weiterlesen',
    loadMoreArticles: 'Weitere Artikel laden',
    
    // Footer
    shippingInfo: 'Versandinfo',
    returnsExchanges: 'Rücksendungen & Umtausch',
    newArrivals: 'Neuankömmlinge',
    cookiePolicy: 'Cookie-Richtlinie',
    faq: 'FAQ',
    bestsellers: 'Bestseller',
    sizeGuide: 'Größentabelle',
    sustainabilityFooter: 'Nachhaltigkeit',
    accessibility: 'Barrierefreiheit',
    privacyPolicy: 'Datenschutzrichtlinie',
    termsOfService: 'Nutzungsbedingungen',
    careers: 'Karriere',
    blog: 'Blog',
    language: 'Sprache',
    theme: 'Thema',
    lightTheme: 'Helles Thema',
    darkTheme: 'Dunkles Thema',
    customerService: 'Kundenservice',
    company: 'Unternehmen',
    newsletter: 'Newsletter',
    stayUpdated: 'Bleiben Sie mit unseren neuesten Kollektionen und exklusiven Angeboten auf dem Laufenden.',
    emailPlaceholder: 'Geben Sie Ihre E-Mail-Adresse ein',
    subscribe: 'Abonnieren',
    allRightsReserved: 'Alle Rechte vorbehalten',
    allProducts: 'Alle Produkte',
    
    // Common
    loading: 'Laden...',
    error: 'Fehler',
    previous: 'Vorherige',
    next: 'Nächste',
    page: 'Seite',
    of: 'von',
    close: 'Schließen',
    open: 'Öffnen',
    save: 'Speichern',
    cancel: 'Abbrechen',
  },
  
  pl: {
    // Header
    home: 'Strona główna',
    store: 'Sklep',
    about: 'O nas',
    contact: 'Kontakt',
    discounts: 'Zniżki',
    newCollection: 'Nowa kolekcja',
    searchPlaceholder: 'Szukaj...',
    
    // Homepage
    heroTitle: 'Te Ipsum',
    heroSubtitle: 'Odzież dla wewnętrznego dialogu',
    discoverProducts: 'Odkryj produkty',
    shopNowButton: 'Kup teraz',
    aboutOurShop: 'O naszym sklepie',
    thoughtfulClothing: 'Przemyślana odzież dla wewnętrznego dialogu.',
    minimalSymbolic: 'Minimalistyczna, symboliczna i stworzona do wyrażania siebie.',
    
    // About Page
    aboutTitle: 'O nas - Nasza historia zrównoważonej mody',
    ourStory: 'Nasza historia',
    thePhilosophy: 'Filozofia',
    sustainability: 'Zrównoważony rozwój',
    community: 'Społeczność',
    futureVision: 'Wizja przyszłości',
    
    // Contact Page
    contactTitle: 'Kontakt - Skontaktuj się z nami',
    getInTouch: 'Skontaktuj się',
    contactSubtitle: 'Chcielibyśmy usłyszeć od Ciebie! Wyślij nam wiadomość, a odpowiemy tak szybko, jak to możliwe.',
    ourStoreLocations: 'Nasze sklepy',
    searchStores: 'Szukaj sklepów...',
    name: 'Imię',
    email: 'E-mail',
    message: 'Wiadomość',
    sendMessage: 'Wyślij wiadomość',
    sending: 'Wysyłanie...',
    
    // Store Page
    storeTitle: 'Sklep - TeIpsum',
    gridView: 'Widok siatki',
    listView: 'Widok listy',
    sortByName: 'Sortuj według nazwy',
    sortByPrice: 'Sortuj według ceny',
    sortByRating: 'Sortuj według oceny',
    sortByNewest: 'Sortuj według najnowszych',
    productsFound: 'produktów znaleziono',
    noProductsFound: 'Nie znaleziono produktów',
    tryAdjustingFilters: 'Spróbuj dostosować filtry lub terminy wyszukiwania.',
    
    // Blog Page
    blogTitle: 'Blog modowy - Trendy, porady i zrównoważony rozwój',
    allPosts: 'Wszystkie posty',
    fashion: 'Moda',
    styleTips: 'Porady stylistyczne',
    companyNews: 'Wiadomości firmy',
    trends: 'Trendy',
    readMore: 'Czytaj więcej',
    loadMoreArticles: 'Załaduj więcej artykułów',
    
    // Footer
    shippingInfo: 'Informacje o wysyłce',
    returnsExchanges: 'Zwroty i wymiany',
    newArrivals: 'Nowości',
    cookiePolicy: 'Polityka cookies',
    faq: 'FAQ',
    bestsellers: 'Bestsellery',
    sizeGuide: 'Tabela rozmiarów',
    sustainabilityFooter: 'Zrównoważony rozwój',
    accessibility: 'Dostępność',
    privacyPolicy: 'Polityka prywatności',
    termsOfService: 'Regulamin',
    careers: 'Kariera',
    blog: 'Blog',
    language: 'Język',
    theme: 'Motyw',
    lightTheme: 'Jasny motyw',
    darkTheme: 'Ciemny motyw',
    customerService: 'Obsługa klienta',
    company: 'Firma',
    newsletter: 'Newsletter',
    stayUpdated: 'Zostaw się na bieżąco z naszymi najnowszymi kolekcjami i wyłącznymi ofertami.',
    emailPlaceholder: 'Wprowadź swój adres e-mail',
    subscribe: 'Subskrybuj',
    allRightsReserved: 'Wszystkie prawa zastrzeżone',
    allProducts: 'Wszystkie produkty',
    
    // Common
    loading: 'Ładowanie...',
    error: 'Błąd',
    previous: 'Poprzednia',
    next: 'Następna',
    page: 'Strona',
    of: 'z',
    close: 'Zamknij',
    open: 'Otwórz',
    save: 'Zapisz',
    cancel: 'Anuluj',
  },
  
  ua: {
    // Header
    home: 'Головна',
    store: 'Магазин',
    about: 'Про нас',
    contact: 'Контакти',
    discounts: 'Знижки',
    newCollection: 'Нова колекція',
    searchPlaceholder: 'Пошук...',
    
    // Homepage
    heroTitle: 'Te Ipsum',
    heroSubtitle: 'Одяг для внутрішнього діалогу',
    discoverProducts: 'Відкрийте продукти',
    shopNowButton: 'Купити зараз',
    aboutOurShop: 'Про наш магазин',
    thoughtfulClothing: 'Продуманий одяг для внутрішнього діалогу.',
    minimalSymbolic: 'Мінімалістичний, символічний і створений для самовираження.',
    
    // About Page
    aboutTitle: 'Про нас - Наша історія сталої моди',
    ourStory: 'Наша історія',
    thePhilosophy: 'Філософія',
    sustainability: 'Сталий розвиток',
    community: 'Спільнота',
    futureVision: 'Бачення майбутнього',
    
    // Contact Page
    contactTitle: 'Контакти - Зв\'яжіться з нами',
    getInTouch: 'Зв\'яжіться з нами',
    contactSubtitle: 'Ми б хотіли почути від вас! Надішліть нам повідомлення, і ми відповімо якомога швидше.',
    ourStoreLocations: 'Наші магазини',
    searchStores: 'Пошук магазинів...',
    name: 'Ім\'я',
    email: 'Електронна пошта',
    message: 'Повідомлення',
    sendMessage: 'Надіслати повідомлення',
    sending: 'Надсилання...',
    
    // Store Page
    storeTitle: 'Магазин - TeIpsum',
    gridView: 'Вигляд сітки',
    listView: 'Вигляд списку',
    sortByName: 'Сортувати за назвою',
    sortByPrice: 'Сортувати за ціною',
    sortByRating: 'Сортувати за рейтингом',
    sortByNewest: 'Сортувати за новизною',
    productsFound: 'товарів знайдено',
    noProductsFound: 'Товари не знайдено',
    tryAdjustingFilters: 'Спробуйте налаштувати фільтри або умови пошуку.',
    
    // Blog Page
    blogTitle: 'Модний блог - Тренди, поради та сталий розвиток',
    allPosts: 'Всі пости',
    fashion: 'Мода',
    styleTips: 'Поради зі стилю',
    companyNews: 'Новини компанії',
    trends: 'Тренди',
    readMore: 'Читати далі',
    loadMoreArticles: 'Завантажити більше статей',
    
    // Footer
    shippingInfo: 'Інформація про доставку',
    returnsExchanges: 'Повернення та обміни',
    newArrivals: 'Новинки',
    cookiePolicy: 'Політика cookies',
    faq: 'FAQ',
    bestsellers: 'Бестселери',
    sizeGuide: 'Таблиця розмірів',
    sustainabilityFooter: 'Сталий розвиток',
    accessibility: 'Доступність',
    privacyPolicy: 'Політика конфіденційності',
    termsOfService: 'Умови використання',
    careers: 'Кар\'єра',
    blog: 'Блог',
    language: 'Мова',
    theme: 'Тема',
    lightTheme: 'Світла тема',
    darkTheme: 'Темна тема',
    customerService: 'Служба підтримки клієнтів',
    company: 'Компанія',
    newsletter: 'Новини',
    stayUpdated: 'Залишайтеся на зв\'язку з нашими найновішими колекціями та виключними пропозиціями.',
    emailPlaceholder: 'Введіть ваш адрес електронної пошти',
    subscribe: 'Підписатися',
    allRightsReserved: 'Всі права захищені',
    allProducts: 'Всі товари',
    
    // Common
    loading: 'Завантаження...',
    error: 'Помилка',
    previous: 'Попередня',
    next: 'Наступна',
    page: 'Сторінка',
    of: 'з',
    close: 'Закрити',
    open: 'Відкрити',
    save: 'Зберегти',
    cancel: 'Скасувати',
  }
};

export const LanguageProvider = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    const savedLanguage = localStorage.getItem('teipsum-language');
    return savedLanguage || 'en';
  });

  const changeLanguage = (language) => {
    setCurrentLanguage(language);
    localStorage.setItem('teipsum-language', language);
  };

  const t = (key) => {
    return translations[currentLanguage]?.[key] || translations.en[key] || key;
  };

  const value = {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: [
      { code: 'en', name: 'English', flag: '🇺🇸' },
      { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
      { code: 'pl', name: 'Polski', flag: '🇵🇱' },
      { code: 'ua', name: 'Українська', flag: '🇺🇦' }
    ]
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}; 