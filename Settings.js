// pages/Settings.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Grid,
  Divider,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Language as LanguageIcon,
  Palette as ThemeIcon,
  Backup as BackupIcon,
  Security as SecurityIcon,
  Notifications as NotificationIcon,
  Business as OrganizationIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { toast } from 'react-toastify';

function Settings() {
  const { t } = useTranslation();
  const { isUrdu, toggleLanguage } = useLanguage();
  const { userRole } = useAuth();
  const [settings, setSettings] = useState({
    organizationName: 'آپ کا مدرسہ',
    organizationAddress: '',
    organizationPhone: '',
    organizationEmail: '',
    currency: 'Rs',
    financialYearStart: 'July',
    darkMode: false,
    notifications: true,
    autoBackup: false,
    receiptTemplate: 'standard'
  });
  const [backupDialogOpen, setBackupDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // Save settings logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Demo delay
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setLoading(false);
    }
  };

  const handleBackup = async () => {
    try {
      setLoading(true);
      // Backup logic here
      await new Promise(resolve => setTimeout(resolve, 2000)); // Demo delay
      toast.success('Backup completed successfully!');
      setBackupDialogOpen(false);
    } catch (error) {
      toast.error('Backup failed');
    } finally {
      setLoading(false);
    }
  };

  const canUpdate = hasPermission(userRole, MODULES.SETTINGS, PERMISSIONS.UPDATE);

  if (!hasPermission(userRole, MODULES.SETTINGS, PERMISSIONS.READ)) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <Typography variant="h6" color="error">
          {t('messages.error.accessDenied')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('navigation.settings')}
        </Typography>
        
        {canUpdate && (
          <Button
            variant="contained"
            onClick={handleSaveSettings}
            disabled={loading}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Save Settings
          </Button>
        )}
      </Box>

      <Grid container spacing={3}>
        {/* Organization Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <OrganizationIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Organization Details
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Organization Name"
                    value={settings.organizationName}
                    onChange={(e) => handleSettingChange('organizationName', e.target.value)}
                    disabled={!canUpdate}
                    className={isUrdu ? 'urdu-text' : 'english-text'}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    multiline
                    rows={2}
                    value={settings.organizationAddress}
                    onChange={(e) => handleSettingChange('organizationAddress', e.target.value)}
                    disabled={!canUpdate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone"
                    value={settings.organizationPhone}
                    onChange={(e) => handleSettingChange('organizationPhone', e.target.value)}
                    disabled={!canUpdate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email"
                    type="email"
                    value={settings.organizationEmail}
                    onChange={(e) => handleSettingChange('organizationEmail', e.target.value)}
                    disabled={!canUpdate}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Financial Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SecurityIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Financial Settings
                </Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Currency Symbol"
                    value={settings.currency}
                    onChange={(e) => handleSettingChange('currency', e.target.value)}
                    disabled={!canUpdate}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Financial Year Start"
                    value={settings.financialYearStart}
                    onChange={(e) => handleSettingChange('financialYearStart', e.target.value)}
                    disabled={!canUpdate}
                    placeholder="July, January, etc."
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Application Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ThemeIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Application Settings
                </Typography>
              </Box>
              
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isUrdu}
                        onChange={toggleLanguage}
                        color="primary"
                        disabled={!canUpdate}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LanguageIcon sx={{ mr: 1 }} />
                        <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                          {isUrdu ? 'اردو زبان' : 'Urdu Language'}
                        </Typography>
                      </Box>
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.darkMode}
                        onChange={(e) => handleSettingChange('darkMode', e.target.checked)}
                        color="primary"
                        disabled={!canUpdate}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <ThemeIcon sx={{ mr: 1 }} />
                        <Typography>Dark Mode</Typography>
                      </Box>
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.notifications}
                        onChange={(e) => handleSettingChange('notifications', e.target.checked)}
                        color="primary"
                        disabled={!canUpdate}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <NotificationIcon sx={{ mr: 1 }} />
                        <Typography>Notifications</Typography>
                      </Box>
                    }
                  />
                </Grid>
                
                <Grid item xs={12} sm={6} md={3}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.autoBackup}
                        onChange={(e) => handleSettingChange('autoBackup', e.target.checked)}
                        color="primary"
                        disabled={!canUpdate}
                      />
                    }
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BackupIcon sx={{ mr: 1 }} />
                        <Typography>Auto Backup</Typography>
                      </Box>
                    }
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Backup & Security */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                Backup & Security
              </Typography>
              
              <Alert severity="info" sx={{ mb: 2 }}>
                <Typography variant="body2" className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Regular backups ensure your data is safe. It's recommended to backup your data weekly.
                </Typography>
              </Alert>
              
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="outlined"
                  startIcon={<BackupIcon />}
                  onClick={() => setBackupDialogOpen(true)}
                  disabled={!canUpdate}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  Create Backup
                </Button>
                
                <Button
                  variant="outlined"
                  color="secondary"
                  disabled={!canUpdate}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  Export Data
                </Button>
                
                <Button
                  variant="outlined"
                  color="warning"
                  disabled={!canUpdate}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  Reset Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Backup Dialog */}
      <Dialog open={backupDialogOpen} onClose={() => setBackupDialogOpen(false)}>
        <DialogTitle className={isUrdu ? 'urdu-text' : 'english-text'}>
          Create Data Backup
        </DialogTitle>
        <DialogContent>
          <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
            This will create a complete backup of all your financial data including income, expenses, 
            stock records, and reports. The backup will be downloaded as a file.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBackupDialogOpen(false)}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleBackup}
            variant="contained"
            disabled={loading}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {loading ? 'Creating Backup...' : 'Create Backup'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Settings;
