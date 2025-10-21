// pages/Login.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  Switch,
  FormControlLabel
} from '@mui/material';
import { Language as LanguageIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { toast } from 'react-toastify';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toggleLanguage, isUrdu } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError(t('auth.invalidCredentials'));
      return;
    }

    try {
      setError('');
      setLoading(true);
      await login(email, password);
      toast.success(t('auth.loginSuccess'));
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      setError(t('auth.invalidCredentials'));
      toast.error(t('auth.invalidCredentials'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh'
        }}
      >
        {/* Language Toggle */}
        <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
          <FormControlLabel
            control={
              <Switch
                checked={isUrdu}
                onChange={toggleLanguage}
                color="primary"
              />
            }
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LanguageIcon fontSize="small" />
                <Typography variant="body2">
                  {isUrdu ? 'اردو' : 'English'}
                </Typography>
              </Box>
            }
          />
        </Box>

        <Paper
          elevation={3}
          sx={{
            marginTop: 8,
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            bgcolor: 'background.paper'
          }}
        >
          {/* App Title */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography 
              component="h1" 
              variant="h4" 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                mb: 1
              }}
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('app.title')}
            </Typography>
            <Typography 
              variant="subtitle1" 
              color="textSecondary"
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('app.subtitle')}
            </Typography>
          </Box>

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                <span className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {error}
                </span>
              </Alert>
            )}
            
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label={t('auth.email')}
              name="email"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              InputLabelProps={{
                className: isUrdu ? 'urdu-text' : 'english-text'
              }}
              InputProps={{
                className: isUrdu ? 'urdu-text' : 'english-text'
              }}
            />
            
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label={t('auth.password')}
              type="password"
              id="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              InputLabelProps={{
                className: isUrdu ? 'urdu-text' : 'english-text'
              }}
              InputProps={{
                className: isUrdu ? 'urdu-text' : 'english-text'
              }}
            />
            
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2, 
                height: 48,
                fontSize: '1.1rem',
                fontWeight: 'bold'
              }}
              disabled={loading}
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                t('auth.signIn')
              )}
            </Button>
            
            <Box sx={{ textAlign: 'center' }}>
              <Typography 
                variant="body2" 
                color="textSecondary"
                className={isUrdu ? 'urdu-text' : 'english-text'}
              >
                {t('auth.forgotPassword')}
              </Typography>
            </Box>
          </Box>

          {/* Demo Credentials */}
          <Box sx={{ mt: 4, p: 2, bgcolor: 'grey.50', borderRadius: 1, width: '100%' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
              Demo Credentials:
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Admin: admin@madrasa.com / admin123
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Manager: manager@madrasa.com / manager123
            </Typography>
            <Typography variant="body2" sx={{ mb: 0.5 }}>
              Accountant: accountant@madrasa.com / accountant123
            </Typography>
            <Typography variant="body2">
              Viewer: viewer@madrasa.com / viewer123
            </Typography>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;
