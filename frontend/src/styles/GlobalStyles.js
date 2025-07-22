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

  .button {
    background-color: #8c4a3a;
    opacity: 0.8;
    color: #fff;
    padding: 12px 20px;
    border-radius: 20px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 1.2rem;
    text-decoration: none;
    transition: background-color 0.3s ease;
    display: inline-block;
    margin-top: 50px;
  }

  .button:hover {
    background-color: #2980b9;
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
