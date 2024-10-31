import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../../services/authService';
import '../../styles/RegistrationForm.css';
import '../../styles/index.css';

const RegistrationForm = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        setLoading(true);

        try {
            await registerUser({ username, password });
            setSuccessMessage('Registration successful! You can now log in.');

            setTimeout(() => {
                navigate('/login');
            }, 2000);
            setUsername('');
            setPassword('');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () =>{
        navigate('/')
    }

    console.log('RegistrationForm rendered.')

    return (
        <div className='registration-container'>
            <div className='registration-card'>
                <h2>Register</h2>
                <form>
                    <input 
                        type="text" 
                        placeholder="Username" 
                        value={username} 
                        onChange={(e) => setUsername(e.target.value)} 
                        required 
                    />
                    <input 
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                <div className='button-container'>
                        <button type="submit" className='button' disabled={loading} onClick={handleSubmit}>Registration</button>
                        <button type="button" className="back-button" onClick={handleBack}>Back</button>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default RegistrationForm;
