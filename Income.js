// pages/Income.js
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
  Fab,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Receipt as ReceiptIcon,
  Share as ShareIcon,
  Print as PrintIcon,
  WhatsApp as WhatsAppIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { INCOME_CATEGORIES, PAYMENT_METHODS } from '../utils/constants';
import { generateReceiptPDF, downloadPDF } from '../utils/pdfGenerator';
import { shareReceiptLink } from '../utils/whatsappIntegration';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Income() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [incomeData, setIncomeData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingIncome, setEditingIncome] = useState(null);
  const [formData, setFormData] = useState({
    donorName: '',
    donorPhone: '',
    amount: '',
    category: '',
    paymentMethod: '',
    description: '',
    date: new Date()
  });
  const [loading, setLoading] = useState(false);

  // Demo data
  useEffect(() => {
    setIncomeData([
      {
        id: 1,
        donorName: 'Ahmad Ali',
        donorPhone: '+92300123456',
        amount: 25000,
        category: 'donation',
        paymentMethod: 'cash',
        description: 'Monthly donation',
        date: new Date(),
        receiptNumber: 'RCP-001'
      },
      {
        id: 2,
        donorName: 'Fatima Khan',
        donorPhone: '+92301234567',
        amount: 50000,
        category: 'zakat',
        paymentMethod: 'bank',
        description: 'Zakat ul Mal',
        date: new Date(Date.now() - 86400000),
        receiptNumber: 'RCP-002'
      }
    ]);
  }, []);

  const handleOpen = (income = null) => {
    if (income) {
      setEditingIncome(income);
      setFormData({
        donorName: income.donorName,
        donorPhone: income.donorPhone,
        amount: income.amount,
        category: income.category,
        paymentMethod: income.paymentMethod,
        description: income.description,
        date: new Date(income.date)
      });
    } else {
      setEditingIncome(null);
      setFormData({
        donorName: '',
        donorPhone: '',
        amount: '',
        category: '',
        paymentMethod: '',
        description: '',
        date: new Date()
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingIncome(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newIncome = {
        ...formData,
        id: editingIncome ? editingIncome.id : Date.now(),
        receiptNumber: editingIncome ? editingIncome.receiptNumber : `RCP-${String(incomeData.length + 1).padStart(3, '0')}`,
        amount: parseFloat(formData.amount)
      };

      if (editingIncome) {
        setIncomeData(incomeData.map(item => 
          item.id === editingIncome.id ? newIncome : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setIncomeData([...incomeData, newIncome]);
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
    if (window.confirm(t('income.deleteIncome') + '?')) {
      setIncomeData(incomeData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const generateReceipt = async (income) => {
    try {
      const receiptData = {
        receiptNumber: income.receiptNumber,
        date: format(new Date(income.date), 'dd/MM/yyyy'),
        donorName: income.donorName,
        donorPhone: income.donorPhone,
        amount: income.amount,
        category: t(`income.categories.${income.category}`),
        paymentMethod: t(`income.${income.paymentMethod}`),
        description: income.description,
        currency: t('common.currency'),
        organizationName: t('app.title')
      };

      const pdf = await generateReceiptPDF(receiptData, isUrdu);
      downloadPDF(pdf, `receipt-${income.receiptNumber}.pdf`);
      toast.success(t('income.receiptGenerated'));
    } catch (error) {
      toast.error(t('messages.error.generalError'));
    }
  };

  const shareReceipt = (income) => {
    const receiptData = {
      receiptNumber: income.receiptNumber,
      date: format(new Date(income.date), 'dd/MM/yyyy'),
      amount: income.amount,
      currency: t('common.currency'),
      organizationName: t('app.title')
    };
    
    shareReceiptLink(income.donorPhone, receiptData);
  };

  const canCreate = hasPermission(userRole, MODULES.INCOME, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.INCOME, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.INCOME, PERMISSIONS.DELETE);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('income.title')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {t('income.addIncome')}
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('dashboard.totalIncome')}
              </Typography>
              <Typography variant="h4" color="primary" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('common.currency')} {incomeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('dashboard.thisMonth')}
              </Typography>
              <Typography variant="h4" color="success.main" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('common.currency')} {incomeData
                  .filter(item => new Date(item.date).getMonth() === new Date().getMonth())
                  .reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                Total Donors
              </Typography>
              <Typography variant="h4" color="info.main" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {new Set(incomeData.map(item => item.donorName)).size}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Income Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.date')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('income.donorName')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.amount')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.category')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('income.paymentMethod')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Receipt
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {incomeData.map((income) => (
                <TableRow key={income.id} hover>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {format(new Date(income.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {income.donorName}
                    <Typography variant="caption" display="block" color="textSecondary">
                      {income.donorPhone}
                    </Typography>
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    <Typography variant="h6" color="primary">
                      {t('common.currency')} {income.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    <Chip 
                      label={t(`income.categories.${income.category}`)} 
                      color="primary" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {t(`income.${income.paymentMethod}`)}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        onClick={() => generateReceipt(income)}
                        title={t('income.generateReceipt')}
                      >
                        <ReceiptIcon />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        onClick={() => shareReceipt(income)}
                        title={t('income.shareReceipt')}
                      >
                        <WhatsAppIcon color="success" />
                      </IconButton>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {canUpdate && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpen(income)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(income.id)}
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
        PaperProps={{
          dir: isUrdu ? 'rtl' : 'ltr'
        }}
      >
        <DialogTitle className={isUrdu ? 'urdu-text' : 'english-text'}>
          {editingIncome ? t('income.editIncome') : t('income.addIncome')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('income.donorName')}
                value={formData.donorName}
                onChange={(e) => setFormData({ ...formData, donorName: e.target.value })}
                required
                InputLabelProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
                InputProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('income.donorPhone')}
                value={formData.donorPhone}
                onChange={(e) => setFormData({ ...formData, donorPhone: e.target.value })}
                InputLabelProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
                InputProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={t('common.amount')}
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                InputLabelProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
                InputProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.category')}
                </InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  {Object.values(INCOME_CATEGORIES).map(category => (
                    <MenuItem key={category} value={category}>
                      <span className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t(`income.categories.${category}`)}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('income.paymentMethod')}
                </InputLabel>
                <Select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  {Object.values(PAYMENT_METHODS).map(method => (
                    <MenuItem key={method} value={method}>
                      <span className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t(`income.${method}`)}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label={t('common.date')}
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label={t('common.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                InputLabelProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
                InputProps={{ className: isUrdu ? 'urdu-text' : 'english-text' }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={handleClose}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !formData.donorName || !formData.amount || !formData.category}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Income;
