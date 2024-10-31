import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { authLoginUser } from '../../services/authService';
import '../../styles/LoginForm.css';
import '../../styles/index.css';

const LoginForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    console.log('LoginForm rendered.')

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        try {
            const credentials = { username, password };
            const response = await authLoginUser(credentials);

            console.log(response);
            
            const { id, username: user, token } = response;

            if (!token || !id || !user) {
                throw new Error('Invalid response from server');
            }

            login({ id, username: user }, token);
            
            setUsername('');
            setPassword('');
            
            navigate('/profile'); 
        } catch (err) {
            setError(err.message);
            console.error('Login error:', err);
        }
    };

    const handleBack = () => {
        navigate('/');
    };

    

    return (
        <div className="login-container">
            <div className="login-card">
                <h2>Login</h2>
                <form>
                    <input
                        type="login"
                        placeholder="Login"
                        required
                        value={username}
                        onChange={(e) => {
                            setUsername(e.target.value);
                            if (error) setError('');
                        }}
                        className={error ? 'error-input' : ''}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            if (error) setError('');
                        }}
                        className={error ? 'error-input' : ''}
                    />
                    <div className="button-container">
                        <button type="submit" className="button" onClick={handleSubmit}>
                            Login
                        </button>
                        <button type="button" className="back-button" onClick={handleBack}>
                            Back
                        </button>
                    </div>
                </form>
                {error && <p className="error-message">{error}</p>}
            </div>
        </div>
    );
};

export default LoginForm;