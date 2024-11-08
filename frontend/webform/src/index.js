import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
// import './styles/index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from './context/AuthContext';
import { BrowserRouter as Router } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    //{/*<React.StrictMode>*/}
        <Router>
            <AuthProvider>
                <App />
            </AuthProvider>
        </Router>
    // {/*</React.StrictMode>*/}
);

reportWebVitals();
