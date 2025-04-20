import React from "react";
import { Avatar, Grid, Paper } from "@mui/material";
import { TextField } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import Button from '@mui/material/Button';
import { useState } from "react";
import Alert from '@mui/material/Alert';
import axios from "axios";
import { Fade } from '@mui/material';




const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const strongPasswordRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const handlePasswordChange = (e) => {
        const value = e.target.value;

        if (!strongPasswordRegex.test(value)) {
            setPasswordError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        } else {
            setPasswordError('');
        }
        setPassword(value);
    };

    const handleEmailChange = (e) => {
        const value = e.target.value;

        if (!emailRegex.test(value)) {
            setEmailError('Please enter a valid email address.');
        } else {
            setEmailError('');
        }
        setEmail(value);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        if (emailError || passwordError || !email || !password) {
            console.warn('feilds are not correct');
            return;
        }

        const data = {
            email,
            password,
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/user/login`, data,{ timeout: process.env.REACT_APP_API_TIMEOUT });

            console.log('Server Response:', response.data);
            showSuccess(response.data.message)
            const token = response.data.token;
            localStorage.setItem('token', token);
            setEmail('');
            setPassword('');
        } catch (error) {
            if (error.response) {
                console.error('Error Response:', error.response.data);
                showError(error.response.data.error);
                setSuccessMessage('');
            } else if (error.request) {
                console.error('No response received:', error.request);
            } else {
                console.error('Axios Error:', error.message);
            }
        }finally {
            setIsLoading(false);
          }
    };

    const isFormInvalid = !email || !password || !!emailError || !!passwordError;


    return (
        <Grid>
            <Paper elevation={10} sx={{ p: 2, height: '70vh', width: 300, m: '20px auto' }}>
                <Grid align='center'>
                    <Avatar sx={{ backgroundColor: '#1bbd7e' }}><LockOutlineIcon /></Avatar>
                    <h2>Login</h2>
                </Grid>
                {successMessage && (<Fade in={true} timeout={500}><Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert></Fade>)}
                {errorMessage && (<Fade in={true} timeout={500}><Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>{errorMessage}</Alert></Fade>)}
                <TextField value={email} onChange={handleEmailChange} variant="standard" label="Email" placeholder="Enter Email" type="email" fullWidth required error={!!emailError} helperText={emailError} />
                <TextField value={password} onChange={handlePasswordChange} variant="standard" label="Password" placeholder="Enter password" type="password" fullWidth required error={!!passwordError} helperText={passwordError} />
                <Button onClick={handleSubmit} sx={{ m: '8px 0' }} disabled={isFormInvalid} type="submit" color="primary" variant="contained" fullWidth>{isLoading ? (<CircularProgress size={24} color="inherit" />) : ('Login' )}</Button>
            </Paper>
        </Grid>
    )
}

export default Login