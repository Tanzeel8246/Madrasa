// pages/Accounts.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AccountBalance as BankIcon,
  MonetizationOn as CashIcon,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { ACCOUNT_TYPES } from '../utils/constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Accounts() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [accountData, setAccountData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);
  const [formData, setFormData] = useState({
    accountName: '',
    accountType: '',
    bankName: '',
    accountNumber: '',
    currentBalance: '',
    description: ''
  });
  const [loading, setLoading] = useState(false);

  // Demo data
  useEffect(() => {
    setAccountData([
      {
        id: 1,
        accountName: 'Main Bank Account',
        accountType: 'bank',
        bankName: 'Bank Alfalah',
        accountNumber: '1234567890',
        currentBalance: 350000,
        description: 'Primary account for all transactions'
      },
      {
        id: 2,
        accountName: 'Cash in Hand',
        accountType: 'cash',
        bankName: '',
        accountNumber: '',
        currentBalance: 25000,
        description: 'Daily cash operations'
      },
      {
        id: 3,
        accountName: 'Savings Account',
        accountType: 'savings',
        bankName: 'Meezan Bank',
        accountNumber: '0987654321',
        currentBalance: 500000,
        description: 'Emergency fund and savings'
      }
    ]);
  }, []);

  const handleOpen = (account = null) => {
    if (account) {
      setEditingAccount(account);
      setFormData({
        accountName: account.accountName,
        accountType: account.accountType,
        bankName: account.bankName,
        accountNumber: account.accountNumber,
        currentBalance: account.currentBalance,
        description: account.description
      });
    } else {
      setEditingAccount(null);
      setFormData({
        accountName: '',
        accountType: '',
        bankName: '',
        accountNumber: '',
        currentBalance: '',
        description: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingAccount(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newAccount = {
        ...formData,
        id: editingAccount ? editingAccount.id : Date.now(),
        currentBalance: parseFloat(formData.currentBalance)
      };

      if (editingAccount) {
        setAccountData(accountData.map(item => 
          item.id === editingAccount.id ? newAccount : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setAccountData([...accountData, newAccount]);
        toast.success(t('messages.success.recordAdded'));
      }
      
      handleClose();
    } catch (error) {
      toast.error(t('messages.error.generalError'));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this account?')) {
      setAccountData(accountData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const getAccountIcon = (type) => {
    switch (type) {
      case 'cash':
        return <CashIcon />;
      case 'bank':
      case 'savings':
        return <BankIcon />;
      default:
        return <BankIcon />;
    }
  };

  const getAccountTypeColor = (type) => {
    switch (type) {
      case 'cash':
        return 'success';
      case 'bank':
        return 'primary';
      case 'savings':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const totalBalance = accountData.reduce((sum, account) => sum + account.currentBalance, 0);
  const bankBalance = accountData.filter(acc => acc.accountType === 'bank' || acc.accountType === 'savings')
                                 .reduce((sum, account) => sum + account.currentBalance, 0);
  const cashBalance = accountData.filter(acc => acc.accountType === 'cash')
                                 .reduce((sum, account) => sum + account.currentBalance, 0);

  const canCreate = hasPermission(userRole, MODULES.ACCOUNTS, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.ACCOUNTS, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.ACCOUNTS, PERMISSIONS.DELETE);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('navigation.accounts')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Add Account
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Balance
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {t('common.currency')} {totalBalance.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Bank Balance
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {t('common.currency')} {bankBalance.toLocaleString()}
                  </Typography>
                </Box>
                <BankIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Cash in Hand
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {t('common.currency')} {cashBalance.toLocaleString()}
                  </Typography>
                </Box>
                <CashIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Accounts Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Account Name</TableCell>
                <TableCell>Type</TableCell>
                <TableCell>Bank Details</TableCell>
                <TableCell>Current Balance</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {accountData.map((account) => (
                <TableRow key={account.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ mr: 2, color: 'primary.main' }}>
                        {getAccountIcon(account.accountType)}
                      </Box>
                      <Typography variant="subtitle2">
                        {account.accountName}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={account.accountType.toUpperCase()} 
                      color={getAccountTypeColor(account.accountType)}
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    {account.bankName ? (
                      <>
                        <Typography variant="body2">
                          {account.bankName}
                        </Typography>
                        <Typography variant="caption" color="textSecondary">
                          {account.accountNumber}
                        </Typography>
                      </>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        N/A
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary">
                      {t('common.currency')} {account.currentBalance.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {account.description}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {canUpdate && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpen(account)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(account.id)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Add/Edit Dialog */}
      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="md" 
        fullWidth
      >
        <DialogTitle>
          {editingAccount ? 'Edit Account' : 'Add Account'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Account Name"
                value={formData.accountName}
                onChange={(e) => setFormData({ ...formData, accountName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.accountType}
                  onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                >
                  {Object.values(ACCOUNT_TYPES).map(type => (
                    <MenuItem key={type} value={type}>
                      {type.toUpperCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            {(formData.accountType === 'bank' || formData.accountType === 'savings') && (
              <>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Bank Name"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Account Number"
                    value={formData.accountNumber}
                    onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                  />
                </Grid>
              </>
            )}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Current Balance"
                type="number"
                value={formData.currentBalance}
                onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !formData.accountName || !formData.accountType || !formData.currentBalance}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Accounts;
