import React, { useState } from 'react';
import { useAuth } from "@/hooks/useAuth";
import BlankLayout from "@/layouts/BlankLayout";
import { useRouter } from "next/router";
import BullLogo from "../../public/images/logo.png";
import Image from 'next/image';
import {
    Container,
    CssBaseline,
    ThemeProvider,
    createTheme,
    Box,
    Paper,
} from '@mui/material';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles((theme) => ({
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '30px',
        width: '450px',
        borderRadius: '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, Oxygen, Ubuntu, Cantarell, \'Open Sans\', \'Helvetica Neue\', sans-serif',
        backgroundColor: theme.palette.background.paper,
    },
    inputForm: {
        border: '1.5px solid',
        borderColor: theme.palette.divider,
        borderRadius: '10px',
        height: '50px',
        display: 'flex',
        alignItems: 'center',
        transition: '0.2s ease-in-out',
    },
    input: {
        padding: '0 10px',
        borderRadius: '10px',
        border: 'none',
        width: '100%',
        height: '100%',
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
    },
    buttonSubmit: {
        margin: '20px 0 10px 0',
        backgroundColor: '#2d79f3',
        border: 'none',
        color: 'white',
        fontSize: '15px',
        fontWeight: 500,
        borderRadius: '10px',
        height: '50px',
        width: '100%',
        cursor: 'pointer',
    },
    flexRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    span: {
        color: '#2d79f3',
        cursor: 'pointer',
    },
    signUpText: {
        textAlign: 'center',
        color: theme.palette.text.primary, // Ensures this text is readable in both modes
        fontSize: '14px',
        margin: '5px 0',
    },
}));

const SignIn = () => {
    const { login } = useAuth();
    const { returnUrl } = useRouter().query;
    const [darkMode, setDarkMode] = useState(false);
    const classes = useStyles();

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const handleSignIn = async (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const email = formData.get("email");
        const password = formData.get("password");

        try {
            await login({ email, password }, returnUrl || "/");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container component="main" maxWidth="xs" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Paper elevation={3} style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: theme.palette.background.paper }}>
                    <Image 
                        src={BullLogo}
                        width={100}
                        height={100}
                        alt="Bull Logo"
                    />
                    <form className={classes.form} onSubmit={handleSignIn}>
                        <Box>
                            <label htmlFor="email">Email</label>
                            <div className={classes.inputForm}>
                                <input
                                    id="email"
                                    placeholder="Enter your Email"
                                    className={classes.input}
                                    type="text"
                                    name="email"
                                    required
                                />
                            </div>
                        </Box>
                        <Box>
                            <label htmlFor="password">Password</label>
                            <div className={classes.inputForm}>
                                <input
                                    id="password"
                                    placeholder="Enter your Password"
                                    className={classes.input}
                                    type="password"
                                    name="password"
                                    required
                                />
                            </div>
                        </Box>
                        <div className={classes.flexRow}>
                            <div>
                                <input type="checkbox" id="remember" aria-label="Remember me" />
                                <label htmlFor="remember">Remember me</label>
                            </div>
                            <span className={classes.span}>Forgot password?</span>
                        </div>
                        <button type="submit" className={classes.buttonSubmit}>Sign In</button>
                        <p className={classes.signUpText}>
                            Don't have an account? <span className={classes.span}>Sign Up</span>
                        </p>
                    </form>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

SignIn.getLayout = (page) => <BlankLayout>{page}</BlankLayout>
SignIn.guestGuard = true
export default SignIn;
