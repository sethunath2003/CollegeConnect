import React from 'react';
import {Link} from 'react-router-dom';
import './styles.css';

const Login = () => {
    return (
        <div className="login-container">
            <h2>Login</h2>
            <form>
                <div>
                    <label>Email:</label>
                    <input type="email" required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" required />
                </div>
                <button type="submit">Login</button>
            </form>
        <div className="signup-link">
            <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
        </div>
        </div>
    );
};

export default Login;