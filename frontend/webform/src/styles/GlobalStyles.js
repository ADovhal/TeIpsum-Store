import { createGlobalStyle } from 'styled-components';


const GlobalStyles = createGlobalStyle`
  // *, *::before, *::after {
  //   box-sizing: border-box;
  //   margin: 0;
  //   padding: 0;
  // }

  body {
    overflow-y: scroll;
    background-color: #E6E6E4
  }

  ::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  /* Для Firefox */
  body {
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
  }

  #root {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
`;

export default GlobalStyles;
