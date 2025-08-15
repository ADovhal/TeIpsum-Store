import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { injectStore as injectUserStore } from './services/apiUser';
import { injectStore as injectOrderStore } from './services/apiOrder';
import { injectStore as injectAdminStore } from './services/apiAdmin';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';
import './i18n/config';

injectUserStore(store);
injectOrderStore(store);
injectAdminStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
);

reportWebVitals();