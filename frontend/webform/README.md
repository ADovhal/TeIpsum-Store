# 🛒 Webform — Frontend do WebShopOnline

## 📋 Opis projektu

**Webform** to część frontendowa projektu **WebShopOnline**, stworzona przy użyciu nowoczesnych technologii frontendowych (**React**, **Redux**, **JavaScript**).  
Aplikacja umożliwia wyświetlanie produktów sklepu oraz uwierzytelnianie użytkowników, z planowanym rozszerzeniem o zarządzanie koszykiem, zamówieniami i płatnościami poprzez komunikację z backendem.

---

## 📂 Struktura katalogów

```
webform/
├── public/
│   ├── favicon.ico
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── assets/
│   │   └── images/
│   │       └── logo.png
│   ├── components/
│   │   ├── Footer/
│   │   │   ├── Footer.js
│   │   │   └── Footer.module.css
│   │   ├── Header/
│   │   │   ├── Header.js
│   │   │   └── Header.module.css
│   │   └── store/
│   │       ├── FilterSidebar.js
│   │       ├── SearchBar.js
│   │       └── StorePageComponents.module.css
│   ├── context/
│   │   └── ViewTypeContext.js
│   ├── features/
│   │   ├── auth/
│   │   │   ├── AuthService.js
│   │   │   ├── authSlice.js
│   │   │   └── components/
│   │   │       ├── AuthForm.module.css
│   │   │       ├── LoginForm.js
│   │   │       └── RegisterForm.js
│   │   ├── cart/
│   │   │   ├── cartSlice.js
│   │   │   └── components/
│   │   │       └── CartItem.js
│   │   ├── orders/
│   │   ├── products/
│   │   │   ├── productSlice.js
│   │   │   ├── ProductService.js
│   │   │   └── components/
│   │   │       ├── ProductBlock.js
│   │   │       ├── ProductBlockStyles.js
│   │   │       ├── ProductCard.js
│   │   │       └── ProductCardStyles.js
│   │   └── profile/
│   │       ├── profileSlice.js
│   │       ├── UserService.js
│   │       └── components/
│   │   │       ├── ProfileData.js
│   │   │       ├── ProfileData.module.css
│   │   │       ├── ProfileForm.js
│   │   │       ├── ProfileForm.module.css
│   ├── pages/
│   │   ├── HomePage.js
│   │   ├── HomePage.module.css
│   │   ├── LoginPage.js
│   │   ├── ProfilePage.js
│   │   ├── RegisterPage.js
│   │   └── StorePage.js
│   ├── redux/
│   │   └── store.js
│   ├── routes/
│   │   └── PrivateRoute.js
│   ├── services/
│   │   └── api.js
│   ├── styles/
│   │   └── GlobalStyles.js
│   ├── utils/
│   │   └── validation.js
│   ├── App.js
│   ├── App.test.js
│   ├── index.js
│   ├── reportWebVitals.js
│   └── setupTests.js
├── .gitignore
├── Dockerfile
├── nginx.template.conf
├── package.json
├── package-lock.json
└── README.md

```

---

## 🚀 Szybki start

### Instalacja zależności

```bash
npm install
```

### Uruchomienie projektu w trybie developerskim

```bash
npm start
```

Aplikacja będzie dostępna pod adresem:
```
http://localhost:3000
```

### Budowanie wersji produkcyjnej

```bash
npm run build
```

Wersja produkcyjna zostanie utworzona w folderze `build/`.

---

## ⚙️ Technologie użyte w projekcie

| Technologia     | Opis                                          |
|-----------------|-----------------------------------------------|
| React           | Budowa interfejsu użytkownika (SPA)           |
| Redux           | Zarządzanie globalnym stanem aplikacji        |
| JavaScript (ES6+)| Logika działania aplikacji klienckiej         |
| HTML5           | Struktura dokumentów WWW                      |
| CSS3            | Stylizacja i układ interfejsu                 |
| React Router    | Routing i nawigacja między stronami           |
| Axios           | Komunikacja z backendem (REST API)            |

---

## 🛠 Główne funkcjonalności

- 🛍  Dynamiczne wyświetlanie produktów sklepu.
- 👤 Przygotowany system uwierzytelniania użytkownika.
- 🔒 Bezpieczne przesyłanie i pobieranie danych (komunikacja z backendem).
- 📱 Responsywny i przyjazny dla użytkownika interfejs.
- 🔄 Przygotowana struktura globalnego zarządzania stanem (Redux Toolkit).

---

## 📈 Plany na dalszy rozwój

- 🔜 Implementacja funkcjonalności koszyka zakupów (dodawanie, usuwanie produktów).
- 🔜 Obsługa zamówień i historii zakupów dla zalogowanych użytkowników.
- 🔜 Rozbudowa profilu użytkownika (edycja danych, zmiana hasła).
- 🔜 Wdrożenie systemu płatności oraz opcji dostawy.
- 🔜 Dodanie sekcji **Contact Us** z formularzem wysyłającym wiadomości e-mail do sklepu.
- 🔜 Stworzenie strony **About Us** z opisem sklepu i lokalizacjami.

---
## 📝 Uwaga dotycząca uruchamiania

Aplikacja jest oparta na React oraz modułach ES6, dlatego wymaga uruchomienia za pomocą środowiska developerskiego (`npm start`) lub zbudowania wersji produkcyjnej (`npm run build`).  
Nie można jej uruchomić bezpośrednio poprzez otwarcie pliku `index.html` w przeglądarce.

## 📬 Kontakt

**Autor projektu**: Andrzej Dowhal  
🔗 [GitHub — ADovhal](https://github.com/ADovhal)

---
> *Frontend stworzony w ramach projektu edukacyjnego WebShopOnline.*
