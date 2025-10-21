// pages/Loans.js
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
  CardContent,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Warning as WarningIcon,
  CheckCircle as CheckIcon,
  TrendingUp,
  TrendingDown
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { LOAN_TYPES, STATUS_TYPES } from '../utils/constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Loans() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [loanData, setLoanData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingLoan, setEditingLoan] = useState(null);
  const [formData, setFormData] = useState({
    personName: '',
    personPhone: '',
    loanType: '',
    amount: '',
    issueDate: new Date(),
    dueDate: new Date(),
    description: '',
    status: 'active'
  });
  const [loading, setLoading] = useState(false);

  // Demo data
  useEffect(() => {
    setLoanData([
      {
        id: 1,
        personName: 'Ahmed Hassan',
        personPhone: '+92300123456',
        loanType: 'given',
        amount: 50000,
        issueDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        description: 'Emergency loan for medical expenses',
        status: 'active'
      },
      {
        id: 2,
        personName: 'Construction Company',
        personPhone: '+92301234567',
        loanType: 'taken',
        amount: 200000,
        issueDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        description: 'Loan for madrasa renovation',
        status: 'active'
      },
      {
        id: 3,
        personName: 'Ali Khan',
        personPhone: '+92302345678',
        loanType: 'given',
        amount: 25000,
        issueDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        dueDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        description: 'Personal loan',
        status: 'active'
      }
    ]);
  }, []);

  const handleOpen = (loan = null) => {
    if (loan) {
      setEditingLoan(loan);
      setFormData({
        personName: loan.personName,
        personPhone: loan.personPhone,
        loanType: loan.loanType,
        amount: loan.amount,
        issueDate: new Date(loan.issueDate),
        dueDate: new Date(loan.dueDate),
        description: loan.description,
        status: loan.status
      });
    } else {
      setEditingLoan(null);
      setFormData({
        personName: '',
        personPhone: '',
        loanType: '',
        amount: '',
        issueDate: new Date(),
        dueDate: new Date(),
        description: '',
        status: 'active'
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingLoan(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newLoan = {
        ...formData,
        id: editingLoan ? editingLoan.id : Date.now(),
        amount: parseFloat(formData.amount)
      };

      if (editingLoan) {
        setLoanData(loanData.map(item => 
          item.id === editingLoan.id ? newLoan : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setLoanData([...loanData, newLoan]);
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
    if (window.confirm('Delete this loan record?')) {
      setLoanData(loanData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const markAsCompleted = (id) => {
    setLoanData(loanData.map(loan => 
      loan.id === id ? { ...loan, status: 'completed' } : loan
    ));
    toast.success('Loan marked as completed');
  };

  const getLoanStatus = (loan) => {
    if (loan.status === 'completed') {
      return { status: 'completed', color: 'success', text: 'Completed' };
    }
    
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    const daysOverdue = Math.ceil((today - dueDate) / (1000 * 60 * 60 * 24));
    
    if (daysOverdue > 0) {
      return { status: 'overdue', color: 'error', text: `${daysOverdue} days overdue` };
    } else if (daysOverdue > -7) {
      return { status: 'due-soon', color: 'warning', text: 'Due soon' };
    }
    
    return { status: 'active', color: 'primary', text: 'Active' };
  };

  const overdueLoans = loanData.filter(loan => {
    const today = new Date();
    const dueDate = new Date(loan.dueDate);
    return loan.status === 'active' && today > dueDate;
  });

  const totalGiven = loanData.filter(loan => loan.loanType === 'given' && loan.status === 'active')
                           .reduce((sum, loan) => sum + loan.amount, 0);
  const totalTaken = loanData.filter(loan => loan.loanType === 'taken' && loan.status === 'active')
                           .reduce((sum, loan) => sum + loan.amount, 0);

  const canCreate = hasPermission(userRole, MODULES.LOANS, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.LOANS, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.LOANS, PERMISSIONS.DELETE);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('navigation.loans')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Add Loan
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {overdueLoans.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
            {overdueLoans.length} loan(s) are overdue and require attention
          </Typography>
        </Alert>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Loans Given
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {t('common.currency')} {totalGiven.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingDown sx={{ fontSize: 40, color: 'primary.main' }} />
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
                    Total Loans Taken
                  </Typography>
                  <Typography variant="h4" color="error">
                    {t('common.currency')} {totalTaken.toLocaleString()}
                  </Typography>
                </Box>
                <TrendingUp sx={{ fontSize: 40, color: 'error.main' }} />
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
                    Overdue Loans
                  </Typography>
                  <Typography variant="h4" color="warning.main">
                    {overdueLoans.length}
                  </Typography>
                </Box>
                <WarningIcon sx={{ fontSize: 40, color: 'warning.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Loans Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Person Details</TableCell>
                <TableCell>Loan Type</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Issue Date</TableCell>
                <TableCell>Due Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loanData.map((loan) => {
                const status = getLoanStatus(loan);
                
                return (
                  <TableRow key={loan.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {loan.personName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {loan.personPhone}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={loan.loanType === 'given' ? 'Given' : 'Taken'} 
                        color={loan.loanType === 'given' ? 'primary' : 'error'}
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color={loan.loanType === 'given' ? 'primary' : 'error'}>
                        {t('common.currency')} {loan.amount.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {format(new Date(loan.issueDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      {format(new Date(loan.dueDate), 'dd/MM/yyyy')}
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={status.text}
                        color={status.color}
                        size="small"
                        icon={status.status === 'completed' ? <CheckIcon /> : 
                              status.status === 'overdue' ? <WarningIcon /> : undefined}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {loan.description}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        {loan.status === 'active' && (
                          <Button
                            size="small"
                            variant="outlined"
                            color="success"
                            onClick={() => markAsCompleted(loan.id)}
                            disabled={!canUpdate}
                          >
                            Complete
                          </Button>
                        )}
                        {canUpdate && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpen(loan)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(loan.id)}
                            color="error"
                          >
                            <DeleteIcon />
                          </IconButton>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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
          {editingLoan ? 'Edit Loan' : 'Add Loan'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Person Name"
                value={formData.personName}
                onChange={(e) => setFormData({ ...formData, personName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Phone Number"
                value={formData.personPhone}
                onChange={(e) => setFormData({ ...formData, personPhone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Loan Type</InputLabel>
                <Select
                  value={formData.loanType}
                  onChange={(e) => setFormData({ ...formData, loanType: e.target.value })}
                >
                  {Object.values(LOAN_TYPES).map(type => (
                    <MenuItem key={type} value={type}>
                      {type === 'given' ? 'Loan Given' : 'Loan Taken'}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Issue Date"
                value={formData.issueDate}
                onChange={(newValue) => setFormData({ ...formData, issueDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Due Date"
                value={formData.dueDate}
                onChange={(newValue) => setFormData({ ...formData, dueDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
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
            disabled={loading || !formData.personName || !formData.loanType || !formData.amount}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Loans;
