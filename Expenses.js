// pages/Expenses.js
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
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  AttachFile as AttachFileIcon,
  Visibility as ViewIcon,
  CloudUpload as UploadIcon,
  Description as DocumentIcon,
  Image as ImageIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useDropzone } from 'react-dropzone';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { EXPENSE_CATEGORIES } from '../utils/constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Expenses() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [expenseData, setExpenseData] = useState([]);
  const [open, setOpen] = useState(false);
  const [billViewOpen, setBillViewOpen] = useState(false);
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    date: new Date(),
    bills: []
  });
  const [loading, setLoading] = useState(false);

  // File upload configuration
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif'],
      'application/pdf': ['.pdf']
    },
    maxFiles: 5,
    maxSize: 5 * 1024 * 1024, // 5MB
    onDrop: (acceptedFiles) => {
      const newBills = acceptedFiles.map(file => ({
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file)
      }));
      setFormData(prev => ({ ...prev, bills: [...prev.bills, ...newBills] }));
    }
  });

  // Demo data
  useEffect(() => {
    setExpenseData([
      {
        id: 1,
        description: 'Teacher salary payment - Muhammad Hassan',
        amount: 35000,
        category: 'salaries',
        date: new Date(),
        bills: [
          {
            name: 'salary_slip.pdf',
            type: 'application/pdf',
            url: '#',
            size: 245760
          }
        ]
      },
      {
        id: 2,
        description: 'Monthly grocery for students',
        amount: 25000,
        category: 'food',
        date: new Date(Date.now() - 86400000),
        bills: [
          {
            name: 'grocery_bill.jpg',
            type: 'image/jpeg',
            url: '#',
            size: 156789
          },
          {
            name: 'receipt.pdf',
            type: 'application/pdf',
            url: '#',
            size: 89456
          }
        ]
      }
    ]);
  }, []);

  const handleOpen = (expense = null) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        description: expense.description,
        amount: expense.amount,
        category: expense.category,
        date: new Date(expense.date),
        bills: expense.bills || []
      });
    } else {
      setEditingExpense(null);
      setFormData({
        description: '',
        amount: '',
        category: '',
        date: new Date(),
        bills: []
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingExpense(null);
    setFormData({
      description: '',
      amount: '',
      category: '',
      date: new Date(),
      bills: []
    });
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newExpense = {
        ...formData,
        id: editingExpense ? editingExpense.id : Date.now(),
        amount: parseFloat(formData.amount)
      };

      if (editingExpense) {
        setExpenseData(expenseData.map(item => 
          item.id === editingExpense.id ? newExpense : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setExpenseData([...expenseData, newExpense]);
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
    if (window.confirm(t('expenses.deleteExpense') + '?')) {
      setExpenseData(expenseData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const removeBill = (index) => {
    setFormData(prev => ({
      ...prev,
      bills: prev.bills.filter((_, i) => i !== index)
    }));
  };

  const viewBills = (expense) => {
    setSelectedExpense(expense);
    setBillViewOpen(true);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type?.startsWith('image/')) {
      return <ImageIcon color="primary" />;
    }
    return <DocumentIcon color="secondary" />;
  };

  const canCreate = hasPermission(userRole, MODULES.EXPENSES, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.EXPENSES, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.EXPENSES, PERMISSIONS.DELETE);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('expenses.title')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {t('expenses.addExpense')}
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('dashboard.totalExpenses')}
              </Typography>
              <Typography variant="h4" color="error" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('common.currency')} {expenseData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
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
              <Typography variant="h4" color="warning.main" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('common.currency')} {expenseData
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
                Total Records
              </Typography>
              <Typography variant="h4" color="info.main" className={isUrdu ? 'urdu-text' : 'english-text'}>
                {expenseData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Expense Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.date')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.description')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.amount')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.category')}
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  Bills
                </TableCell>
                <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('common.actions')}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseData.map((expense) => (
                <TableRow key={expense.id} hover>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {format(new Date(expense.date), 'dd/MM/yyyy')}
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {expense.description}
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    <Typography variant="h6" color="error">
                      {t('common.currency')} {expense.amount.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                    <Chip 
                      label={t(`expenses.categories.${expense.category}`)} 
                      color="secondary" 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Chip 
                        label={`${expense.bills?.length || 0} files`}
                        size="small"
                        variant="outlined"
                      />
                      {expense.bills?.length > 0 && (
                        <IconButton 
                          size="small" 
                          onClick={() => viewBills(expense)}
                          title={t('expenses.viewBill')}
                        >
                          <ViewIcon />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {canUpdate && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpen(expense)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canDelete && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(expense.id)}
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
          {editingExpense ? t('expenses.editExpense') : t('expenses.addExpense')}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={t('common.description')}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                multiline
                rows={2}
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
                  {Object.values(EXPENSE_CATEGORIES).map(category => (
                    <MenuItem key={category} value={category}>
                      <span className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t(`expenses.categories.${category}`)}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <DatePicker
                label={t('common.date')}
                value={formData.date}
                onChange={(newValue) => setFormData({ ...formData, date: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            
            {/* File Upload Section */}
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom className={isUrdu ? 'urdu-text' : 'english-text'}>
                {t('expenses.attachBill')}
              </Typography>
              
              <Box
                {...getRootProps()}
                sx={{
                  border: '2px dashed',
                  borderColor: isDragActive ? 'primary.main' : 'grey.300',
                  borderRadius: 2,
                  p: 3,
                  textAlign: 'center',
                  cursor: 'pointer',
                  bgcolor: isDragActive ? 'primary.light' : 'grey.50',
                  '&:hover': {
                    borderColor: 'primary.main',
                    bgcolor: 'primary.light'
                  }
                }}
              >
                <input {...getInputProps()} />
                <UploadIcon sx={{ fontSize: 48, color: 'grey.400', mb: 1 }} />
                <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {isDragActive
                    ? 'Drop files here...'
                    : 'Drag & drop files here, or click to select files'
                  }
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Supported: JPG, PNG, PDF (Max 5MB each)
                </Typography>
              </Box>
              
              {/* Uploaded Files List */}
              {formData.bills.length > 0 && (
                <List sx={{ mt: 2 }}>
                  {formData.bills.map((bill, index) => (
                    <ListItem 
                      key={index}
                      secondaryAction={
                        <IconButton
                          edge="end"
                          onClick={() => removeBill(index)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      }
                    >
                      <ListItemAvatar>
                        <Avatar>
                          {getFileIcon(bill.type)}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={bill.name}
                        secondary={formatFileSize(bill.size)}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
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
            disabled={loading || !formData.description || !formData.amount || !formData.category}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bill View Dialog */}
      <Dialog 
        open={billViewOpen} 
        onClose={() => setBillViewOpen(false)} 
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle className={isUrdu ? 'urdu-text' : 'english-text'}>
          {t('expenses.viewBill')} - {selectedExpense?.description}
        </DialogTitle>
        <DialogContent>
          {selectedExpense?.bills?.length > 0 ? (
            <List>
              {selectedExpense.bills.map((bill, index) => (
                <ListItem 
                  key={index}
                  button
                  onClick={() => window.open(bill.url, '_blank')}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {getFileIcon(bill.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={bill.name}
                    secondary={formatFileSize(bill.size)}
                  />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
              {t('common.noData')}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button 
            onClick={() => setBillViewOpen(false)}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {t('common.cancel')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Expenses;
