import React, { useState } from 'react';
import BlankLayout from "@/layouts/BlankLayout";
import {
    Box,
    Container,
    CssBaseline,
    Paper,
    ThemeProvider,
    createTheme,
    TextField,
    Button,
    Typography
} from '@mui/material';
import Image from 'next/image';
import BullLogo from "../../../public/images/logo.png";
import { useRouter } from 'next/router';
import { useAuth } from '@/hooks/useAuth';

const ForgotPassword = () => {
    const theme = createTheme({
        palette: {
            mode: 'light',
        },
    });

    const [email, setEmail] = useState('');
    const { login } = useAuth();
    const router = useRouter();
    const { returnUrl } = router.query;

    const handleForgotPassword = (e) => {
        e.preventDefault();
        console.log('Forgot Password for:', email);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container
                component="main"
                maxWidth="xs"
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        padding: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        backgroundColor: 'background.paper',
                        borderRadius: 2,
                        width: '100%',
                        boxSizing: 'border-box',
                    }}
                >
                    <Image src={BullLogo} width={100} height={100} alt="Bull Logo" />
                    <Typography variant="h5" component="h1" sx={{ mt: 2, mb: 1 }}>
                        Forgot Password
                    </Typography>
                    <Box
                        component="form"
                        onSubmit={handleForgotPassword}
                        sx={{
                            mt: 1,
                            width: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <TextField
                            label="Email"
                            variant="outlined"
                            fullWidth
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{
                                py: 1.5,
                            }}
                        >
                            Reset Password
                        </Button>
                        <Typography variant="body2" align="center" color="text.secondary">
                            Already have an account?{' '}
                            <Typography
                                component="span"
                                sx={{ color: '#2d79f3', cursor: 'pointer' }}
                                onClick={() => router.push('/auth/login')}
                            >
                                Sign In
                            </Typography>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
        </ThemeProvider>
    );
};

ForgotPassword.getLayout = (page) => <BlankLayout>{page}</BlankLayout>;
ForgotPassword.guestGuard = true;

export default ForgotPassword;
