import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { api } from '../../Global/constants';
import './LoginPage.css';

async function loginUser(credentials) {
    try {
        const response = await fetch(`${api}/signin`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        return result;
    }
    catch (err) {
        console.log(err);
        return null;
    }
}

export default function LoginPage({ setToken }) {
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    const handleSubmit = async e => {
        e.preventDefault();
        const token = await loginUser({
            email,
            password
        });
        if (token) {
            setToken(token);
        }
    }


    return (
        <div className="login-wrapper">
            <Card component="div" className="login-card">
                <Typography variant="h4" className="login-title">Log in</Typography>
                <form onSubmit={handleSubmit} className="login-form">
                    <TextField
                        required
                        id="email"
                        label="Email"
                        onChange={e => setEmail(e.target.value)}
                    />
                    <TextField
                        id="password"
                        label="Password"
                        onChange={e => setPassword(e.target.value)}
                        helperText="Leave empty"
                    />
                    <div>
                        <Button type="submit" variant="contained">Sign In</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}

LoginPage.propTypes = {
    setToken: PropTypes.func.isRequired
}
