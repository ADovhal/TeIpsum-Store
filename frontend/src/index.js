import React from 'react';
import ReactDOM from 'react-dom/client';
import 'font-awesome/css/font-awesome.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
import { injectStore } from './services/apiUser';
import store from './redux/store';
import { BrowserRouter as Router } from 'react-router-dom';

injectStore(store);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
        <Router>
            <Provider store={store}>
                <App />
            </Provider>
        </Router>
);

reportWebVitals();
