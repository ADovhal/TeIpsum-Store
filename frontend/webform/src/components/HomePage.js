import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css';
import '../styles/index.css';

const HomePage = () => {
    const navigate = useNavigate();
    console.log('HomePage component rendered');

    return (
        <div className="home-container">
            <div className="home-card">
                <h1>Welcome to Our App</h1>
                <p>Please choose an option below:</p>
                <div className="button-container">
                    <button className="button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                    <button className="button" onClick={() => navigate('/register')}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
