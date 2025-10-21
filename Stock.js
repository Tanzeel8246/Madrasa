// pages/Stock.js
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
  CheckCircle as CheckIcon
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { STOCK_CATEGORIES } from '../utils/constants';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Stock() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [stockData, setStockData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingStock, setEditingStock] = useState(null);
  const [formData, setFormData] = useState({
    itemName: '',
    category: '',
    quantity: '',
    unit: '',
    pricePerUnit: '',
    totalValue: '',
    minStockLevel: '',
    supplier: '',
    purchaseDate: new Date(),
    expiryDate: null,
    location: ''
  });
  const [loading, setLoading] = useState(false);

  // Demo data
  useEffect(() => {
    setStockData([
      {
        id: 1,
        itemName: 'Rice - Basmati',
        category: 'kitchen',
        quantity: 50,
        unit: 'kg',
        pricePerUnit: 150,
        totalValue: 7500,
        minStockLevel: 20,
        supplier: 'Local Supplier',
        purchaseDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        location: 'Storage Room A'
      },
      {
        id: 2,
        itemName: 'Exercise Books',
        category: 'stationery',
        quantity: 15,
        unit: 'pcs',
        pricePerUnit: 25,
        totalValue: 375,
        minStockLevel: 50,
        supplier: 'Stationery Mart',
        purchaseDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
        expiryDate: null,
        location: 'Office'
      },
      {
        id: 3,
        itemName: 'Cooking Oil',
        category: 'kitchen',
        quantity: 5,
        unit: 'liters',
        pricePerUnit: 300,
        totalValue: 1500,
        minStockLevel: 10,
        supplier: 'Grocery Store',
        purchaseDate: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        location: 'Kitchen Storage'
      }
    ]);
  }, []);

  const handleOpen = (stock = null) => {
    if (stock) {
      setEditingStock(stock);
      setFormData({
        itemName: stock.itemName,
        category: stock.category,
        quantity: stock.quantity,
        unit: stock.unit,
        pricePerUnit: stock.pricePerUnit,
        totalValue: stock.totalValue,
        minStockLevel: stock.minStockLevel,
        supplier: stock.supplier,
        purchaseDate: new Date(stock.purchaseDate),
        expiryDate: stock.expiryDate ? new Date(stock.expiryDate) : null,
        location: stock.location
      });
    } else {
      setEditingStock(null);
      setFormData({
        itemName: '',
        category: '',
        quantity: '',
        unit: '',
        pricePerUnit: '',
        totalValue: '',
        minStockLevel: '',
        supplier: '',
        purchaseDate: new Date(),
        expiryDate: null,
        location: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingStock(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newStock = {
        ...formData,
        id: editingStock ? editingStock.id : Date.now(),
        quantity: parseFloat(formData.quantity),
        pricePerUnit: parseFloat(formData.pricePerUnit),
        totalValue: parseFloat(formData.quantity) * parseFloat(formData.pricePerUnit),
        minStockLevel: parseFloat(formData.minStockLevel)
      };

      if (editingStock) {
        setStockData(stockData.map(item => 
          item.id === editingStock.id ? newStock : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setStockData([...stockData, newStock]);
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
    if (window.confirm('Delete this stock item?')) {
      setStockData(stockData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const getStockStatus = (item) => {
    if (item.quantity <= item.minStockLevel) {
      return { status: 'low', color: 'error', icon: <WarningIcon /> };
    }
    return { status: 'good', color: 'success', icon: <CheckIcon /> };
  };

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'none', color: 'default' };
    
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysToExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    
    if (daysToExpiry < 0) {
      return { status: 'expired', color: 'error', text: 'Expired' };
    } else if (daysToExpiry <= 30) {
      return { status: 'expiring', color: 'warning', text: `${daysToExpiry} days left` };
    }
    return { status: 'good', color: 'success', text: 'Good' };
  };

  const lowStockItems = stockData.filter(item => item.quantity <= item.minStockLevel);
  const expiringItems = stockData.filter(item => {
    if (!item.expiryDate) return false;
    const daysToExpiry = Math.ceil((new Date(item.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
    return daysToExpiry <= 30 && daysToExpiry >= 0;
  });

  const canCreate = hasPermission(userRole, MODULES.STOCK, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.STOCK, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.STOCK, PERMISSIONS.DELETE);

  return (
    <Box>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('navigation.stock')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Add Stock Item
          </Button>
        )}
      </Box>

      {/* Alerts */}
      {(lowStockItems.length > 0 || expiringItems.length > 0) && (
        <Box sx={{ mb: 3 }}>
          {lowStockItems.length > 0 && (
            <Alert severity="error" sx={{ mb: 1 }}>
              <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                {lowStockItems.length} item(s) are running low on stock
              </Typography>
            </Alert>
          )}
          {expiringItems.length > 0 && (
            <Alert severity="warning">
              <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                {expiringItems.length} item(s) are expiring within 30 days
              </Typography>
            </Alert>
          )}
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Items
              </Typography>
              <Typography variant="h4" color="primary">
                {stockData.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Value
              </Typography>
              <Typography variant="h4" color="success.main">
                {t('common.currency')} {stockData.reduce((sum, item) => sum + item.totalValue, 0).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Low Stock
              </Typography>
              <Typography variant="h4" color="error">
                {lowStockItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Expiring Soon
              </Typography>
              <Typography variant="h4" color="warning.main">
                {expiringItems.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Stock Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Item Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Price/Unit</TableCell>
                <TableCell>Total Value</TableCell>
                <TableCell>Stock Status</TableCell>
                <TableCell>Expiry Status</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stockData.map((stock) => {
                const stockStatus = getStockStatus(stock);
                const expiryStatus = getExpiryStatus(stock.expiryDate);
                
                return (
                  <TableRow key={stock.id} hover>
                    <TableCell>
                      <Typography variant="subtitle2">
                        {stock.itemName}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        {stock.supplier}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        label={stock.category} 
                        color="primary" 
                        size="small" 
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {stock.quantity} {stock.unit}
                      </Typography>
                      <Typography variant="caption" color="textSecondary">
                        Min: {stock.minStockLevel}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {t('common.currency')} {stock.pricePerUnit}
                    </TableCell>
                    <TableCell>
                      <Typography variant="h6" color="success.main">
                        {t('common.currency')} {stock.totalValue.toLocaleString()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={stockStatus.icon}
                        label={stockStatus.status === 'low' ? 'Low Stock' : 'Good'}
                        color={stockStatus.color}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {stock.expiryDate ? (
                        <Chip 
                          label={expiryStatus.text}
                          color={expiryStatus.color}
                          size="small"
                        />
                      ) : (
                        <Typography variant="caption" color="textSecondary">
                          No expiry
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {stock.location}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        {canUpdate && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleOpen(stock)}
                            color="primary"
                          >
                            <EditIcon />
                          </IconButton>
                        )}
                        {canDelete && (
                          <IconButton 
                            size="small" 
                            onClick={() => handleDelete(stock.id)}
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
          {editingStock ? 'Edit Stock Item' : 'Add Stock Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Item Name"
                value={formData.itemName}
                onChange={(e) => setFormData({ ...formData, itemName: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {Object.values(STOCK_CATEGORIES).map(category => (
                    <MenuItem key={category} value={category}>
                      {category}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Quantity"
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Unit"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="kg, pcs, liters, etc."
                required
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Price per Unit"
                type="number"
                value={formData.pricePerUnit}
                onChange={(e) => setFormData({ ...formData, pricePerUnit: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Minimum Stock Level"
                type="number"
                value={formData.minStockLevel}
                onChange={(e) => setFormData({ ...formData, minStockLevel: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Supplier"
                value={formData.supplier}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Purchase Date"
                value={formData.purchaseDate}
                onChange={(newValue) => setFormData({ ...formData, purchaseDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Expiry Date (Optional)"
                value={formData.expiryDate}
                onChange={(newValue) => setFormData({ ...formData, expiryDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Storage Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading || !formData.itemName || !formData.quantity || !formData.pricePerUnit}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Stock;
