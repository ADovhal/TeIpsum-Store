// src/styles/GlobalStyles.js
import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: 'Roboto', sans-serif;
    // color: #333;
    background: linear-gradient(135deg, #f7b7a3, #a29bfe); /* Градиент от персикового к светло-фиолетовому */
    overflow-y: scroll; /* Постоянный вертикальный скроллбар для устранения сдвигов */
  }

  ::-webkit-scrollbar {
    width: 0; /* Убираем скроллбар */
    height: 0; /* Убираем скроллбар для горизонтального скролла */
  }

  /* Для Firefox */
  body {
    scrollbar-width: thin; /* Устанавливаем невидимый, но функциональный скролл */
    scrollbar-color: transparent transparent; /* Скроллбар будет прозрачным */
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh; /* Контейнер заполняет весь экран */
  }
`;

export default GlobalStyles;
