import React, { useState } from 'react';
import {Link,useNavigate} from 'react-router-dom';

const Login = () => {
    const navigate=useNavigate();
    const[formData,setFormData]=useState({
        email:'',
        password:''
    })
    const handleSubmit=async (e) => {
        e.preventDefault();
        //login authentication logic here
        try{
            const loginSuccessful=true;//replace with actual login logic
            if(loginSuccessful){
                navigate('/homepage');
            }
        }
        catch(error){
            console.error("Login failed",error);
        }
    };
    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <h2>Login</h2>
            <form>
                <div className='flex justify-center items-center h-screen bg-gray-100'>
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