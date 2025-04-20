import React from "react";
import PasswordRequirements from "../PasswordRequirement/PasswordRequirement";
import { Avatar, Grid, Paper, Typography } from "@mui/material";
import { TextField } from '@mui/material';
import LockOutlineIcon from '@mui/icons-material/LockOutline';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import LinearProgress from '@mui/material/LinearProgress';
import { useState } from "react";
import axios from "axios";
import { Link as RouterLink } from 'react-router-dom';
import { Link as MuiLink } from '@mui/material';
import Alert from '@mui/material/Alert';
import { Fade } from '@mui/material';
import CircularProgress from '@mui/material/CircularProgress';



const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState('');
    const [passwordStrengthLabel, setPasswordStrengthLabel] = useState('');
    const [passwordFieldFocused, setPasswordFieldFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const phoneRegex = /^09\d{9}$/;
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#\$%\^&\*])[A-Za-z\d!@#\$%\^&\*]{8,}$/;
    const mediumPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])[A-Za-z\d!@#\$%\^&\*]{6,}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const [passwordRequirements, setPasswordRequirements] = useState({
        hasLowerCase: false, hasUpperCase: false, hasNumber: false, hasSpecialChar: false, hasMinLength: false,
    });

    const showSuccess = (message) => {
        setSuccessMessage(message);
        setTimeout(() => setSuccessMessage(''), 5000);
    };

    const showError = (message) => {
        setErrorMessage(message);
        setTimeout(() => setErrorMessage(''), 5000);
    };

    const checkPasswordRequirements = (password) => {
        setPasswordRequirements({
            hasLowerCase: /[a-z]/.test(password),
            hasUpperCase: /[A-Z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*]/.test(password),
            hasMinLength: password.length >= 8,
        });
    };

    const evaluatePasswordStrength = (password) => {
        if (strongPasswordRegex.test(password)) {
            setPasswordStrength(100);
            setPasswordStrengthLabel('Strong');
        } else if (mediumPasswordRegex.test(password)) {
            setPasswordStrength(60);
            setPasswordStrengthLabel('Medium');
        } else if (password.length > 0) {
            setPasswordStrength(30);
            setPasswordStrengthLabel('Weak');
        } else {
            setPasswordStrength(0);
            setPasswordStrengthLabel('');
        }
    };


    const validatePassword = (value) => {
        if (!strongPasswordRegex.test(value)) {
            setPasswordError("Password must be at least 8 characters and include uppercase, lowercase, number, and special character.");
            return false;
        } else {
            setPasswordError("");
            return true;
        }
    };



    const isFormInvalid = !email || !password || !!emailError || !!passwordError || !phone || !!phoneError;


    const handlePasswordChange = (e) => {
        const value = e.target.value;
        evaluatePasswordStrength(value);
        checkPasswordRequirements(value);
        validatePassword(value);
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

    const handlePhoneChange = (e) => {
        const value = e.target.value;
        if (!phoneRegex.test(value)) {
            setPhoneError('the phone number is invalid ex: 09123456789');
        } else {
            setPhoneError('');
        }
        setPhone(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        if (emailError || passwordError !== "" || phoneError || !email || password === "" || !phone) {
            console.warn('feilds are not correct');
            return;
        }

        const data = {
            name, email, password, phone
        };

        try {
            const response = await axios.post(
                `${process.env.REACT_APP_API_BASE_URL}/user/register`, data,
                { timeout: process.env.REACT_APP_API_TIMEOUT }
            );
            console.log('Server Response:', response.data);
            showSuccess(response.data);
            setErrorMessage('');
            setEmail('');
            setName('');
            setPassword('');
            setPhone('');
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

    return (
        <Grid>
            <Paper elevation={10} sx={{ p: 2, height: '70vh', width: 300, m: '20px auto' }}>
                <Grid align='center'>
                    <Avatar sx={{ backgroundColor: '#1bbd7e' }}><LockOutlineIcon /></Avatar>
                    <h2>Sign Up</h2>
                </Grid>
                {successMessage && (<Fade in={true} timeout={500}><Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>{successMessage}</Alert></Fade>)}
                {errorMessage && (<Fade in={true} timeout={500}><Alert severity="error" sx={{ mb: 2 }} onClose={() => setErrorMessage('')}>{errorMessage}</Alert></Fade>)}
                <TextField value={name} onChange={(e) => setName(e.target.value)} variant="standard" label="Name" placeholder="Enter name" fullWidth required />
                <TextField value={phone} inputProps={{ maxLength: 11 }} onChange={handlePhoneChange} variant="standard" label="Phone Number" placeholder="Enter phone number" fullWidth required error={!!phoneError} helperText={phoneError} />
                <TextField value={email} onChange={handleEmailChange} variant="standard" label="Email" placeholder="Enter Email" type="email" fullWidth required error={!!emailError} helperText={emailError} />
                <TextField value={password} onFocus={() => setPasswordFieldFocused(true)} onBlur={() => setPasswordFieldFocused(false)} onChange={handlePasswordChange} variant="standard" label="Password" placeholder="Enter password" type="password" fullWidth required error={!!passwordError} helperText={passwordError} />
                {passwordFieldFocused && <PasswordRequirements requirements={passwordRequirements} />}
                {passwordStrength > 0 && (
                    <>
                        <LinearProgress variant="determinate" value={passwordStrength} sx={{ height: 8, borderRadius: 5, mt: 1, backgroundColor: '#eee', '& .MuiLinearProgress-bar': { backgroundColor: passwordStrength === 100 ? 'green' : passwordStrength === 60 ? 'orange' : 'red', }, }} />
                        <div>
                            <Typography variant="caption" style={{ width: '100%', color: passwordStrength === 100 ? 'green' : passwordStrength === 60 ? 'orange' : 'red' }}>{passwordStrengthLabel} </Typography>
                        </div>
                    </>
                )}
                <Button onClick={handleSubmit} sx={{ m: '8px 0' }} type="submit" color="primary" variant="contained" fullWidth disabled={isFormInvalid} >{isLoading ? (<CircularProgress size={24} color="inherit" />) : ('Sign Up' )}</Button>
                <Typography>
                    <Link href="#">
                        Forgot Password ?
                    </Link>
                </Typography>
                <Typography> Do You Have An Account ?
                    <MuiLink component={RouterLink} to="/login">
                        Login
                    </MuiLink>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default SignUp