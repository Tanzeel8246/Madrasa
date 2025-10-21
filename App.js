// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Context Providers
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';

// Components
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Income from './pages/Income';
import Expenses from './pages/Expenses';
import Stock from './pages/Stock';
import Reports from './pages/Reports';
import Accounts from './pages/Accounts';
import Loans from './pages/Loans';
import Users from './pages/Users';
import Settings from './pages/Settings';

// Import i18n configuration
import './i18n';

// Import styles
import './App.css';

// Create Material-UI theme with Islamic colors
const theme = createTheme({
  palette: {
    primary: {
      main: '#16a34a', // Islamic green
      light: '#22c55e',
      dark: '#15803d',
    },
    secondary: {
      main: '#f59e0b', // Gold
      light: '#fbbf24',
      dark: '#d97706',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Inter", "Noto Nastaliq Urdu", serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: '"Inter", "Noto Nastaliq Urdu", serif',
        },
      },
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <LanguageProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={
                  <ProtectedRoute>
                    <Layout>
                      <Routes>
                        <Route index element={<Dashboard />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="income" element={<Income />} />
                        <Route path="expenses" element={<Expenses />} />
                        <Route path="stock" element={<Stock />} />
                        <Route path="reports" element={<Reports />} />
                        <Route path="accounts" element={<Accounts />} />
                        <Route path="loans" element={<Loans />} />
                        <Route path="users" element={<Users />} />
                        <Route path="settings" element={<Settings />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>
                } />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
              
              <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
              />
            </div>
          </Router>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
