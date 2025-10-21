// pages/Reports.js
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Assessment as ReportIcon,
  PictureAsPdf as PdfIcon,
  WhatsApp as WhatsAppIcon,
  DateRange as DateIcon,
  TrendingUp,
  TrendingDown,
  AccountBalance
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { generateReportPDF, downloadPDF } from '../utils/pdfGenerator';
import { shareReportLink } from '../utils/whatsappIntegration';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Reports() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState('');
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    endDate: new Date()
  });
  const [generatingReport, setGeneratingReport] = useState(false);

  // Demo data for charts
  const monthlyData = [
    { month: 'Jan', income: 120000, expenses: 80000 },
    { month: 'Feb', income: 150000, expenses: 90000 },
    { month: 'Mar', income: 100000, expenses: 85000 },
    { month: 'Apr', income: 180000, expenses: 95000 },
    { month: 'May', income: 125000, expenses: 85000 },
    { month: 'Jun', income: 135000, expenses: 88000 }
  ];

  const categoryData = [
    { name: 'Donations', value: 450000, color: '#22c55e' },
    { name: 'Zakat', value: 200000, color: '#3b82f6' },
    { name: 'Fees', value: 150000, color: '#f59e0b' },
    { name: 'Other', value: 100000, color: '#ef4444' }
  ];

  const reportTypes = [
    {
      type: 'monthly',
      title: t('reports.monthlyReport'),
      description: 'Monthly income and expense summary',
      icon: <DateIcon />
    },
    {
      type: 'annual',
      title: t('reports.annualReport'),
      description: 'Annual financial overview',
      icon: <ReportIcon />
    },
    {
      type: 'income',
      title: t('reports.incomeReport'),
      description: 'Detailed income analysis',
      icon: <TrendingUp />
    },
    {
      type: 'expense',
      title: t('reports.expenseReport'),
      description: 'Detailed expense analysis',
      icon: <TrendingDown />
    },
    {
      type: 'donor',
      title: t('reports.donorReport'),
      description: 'Donor contribution summary',
      icon: <AccountBalance />
    }
  ];

  const handleGenerateReport = async (type, export_format = 'view') => {
    try {
      setGeneratingReport(true);
      
      const reportData = {
        title: reportTypes.find(r => r.type === type)?.title || 'Financial Report',
        startDate: format(dateRange.startDate, 'dd/MM/yyyy'),
        endDate: format(dateRange.endDate, 'dd/MM/yyyy'),
        organizationName: t('app.title'),
        summary: {
          totalIncome: 'Rs 900,000',
          totalExpenses: 'Rs 523,000',
          balance: 'Rs 377,000'
        },
        headers: ['Date', 'Description', 'Category', 'Amount', 'Type'],
        tableData: [
          {
            date: '01/06/2024',
            description: 'Monthly donation',
            category: 'Donation',
            amount: 'Rs 25,000',
            type: 'Income'
          },
          {
            date: '02/06/2024',
            description: 'Teacher salary',
            category: 'Salary',
            amount: 'Rs 15,000',
            type: 'Expense'
          }
        ]
      };

      if (export_format === 'pdf') {
        const pdf = await generateReportPDF(reportData, isUrdu);
        downloadPDF(pdf, `${type}_report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
        toast.success(t('reports.exportPDF') + ' successful!');
      } else if (export_format === 'whatsapp') {
        shareReportLink('+92300123456', reportData);
        toast.success('Report shared via WhatsApp!');
      } else {
        toast.success(t('messages.success.reportGenerated'));
      }
    } catch (error) {
      toast.error(t('messages.error.generalError'));
    } finally {
      setGeneratingReport(false);
    }
  };

  const openReportDialog = (type) => {
    setSelectedReportType(type);
    setReportDialogOpen(true);
  };

  const canRead = hasPermission(userRole, MODULES.REPORTS, PERMISSIONS.READ);
  const canCreate = hasPermission(userRole, MODULES.REPORTS, PERMISSIONS.CREATE);

  if (!canRead) {
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
          {t('reports.title')}
        </Typography>
      </Box>

      {/* Quick Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Month Income
              </Typography>
              <Typography variant="h4" color="success.main">
                {t('common.currency')} 135,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                This Month Expenses
              </Typography>
              <Typography variant="h4" color="error.main">
                {t('common.currency')} 88,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Net Balance
              </Typography>
              <Typography variant="h4" color="primary.main">
                {t('common.currency')} 47,000
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Income vs Expenses
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${t('common.currency')} ${value.toLocaleString()}`, '']} />
                <Bar dataKey="income" fill="#22c55e" name="Income" />
                <Bar dataKey="expenses" fill="#ef4444" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography variant="h6" gutterBottom>
              Income by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${t('common.currency')} ${value.toLocaleString()}`, '']} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Report Types */}
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Generate Reports
      </Typography>
      
      <Grid container spacing={3}>
        {reportTypes.map((report) => (
          <Grid item xs={12} sm={6} md={4} key={report.type}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    bgcolor: 'primary.light', 
                    borderRadius: 2, 
                    p: 1, 
                    mr: 2,
                    color: 'primary.main'
                  }}>
                    {report.icon}
                  </Box>
                  <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
                    {report.title}
                  </Typography>
                </Box>
                <Typography 
                  variant="body2" 
                  color="textSecondary"
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  {report.description}
                </Typography>
              </CardContent>
              <CardActions>
                <Button 
                  size="small" 
                  onClick={() => openReportDialog(report.type)}
                  disabled={!canCreate}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  Generate
                </Button>
                <Button 
                  size="small" 
                  startIcon={<PdfIcon />}
                  onClick={() => handleGenerateReport(report.type, 'pdf')}
                  disabled={generatingReport || !canCreate}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  PDF
                </Button>
                <Button 
                  size="small" 
                  startIcon={<WhatsAppIcon />}
                  onClick={() => handleGenerateReport(report.type, 'whatsapp')}
                  disabled={generatingReport || !canCreate}
                  color="success"
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  Share
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Report Generation Dialog */}
      <Dialog open={reportDialogOpen} onClose={() => setReportDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle className={isUrdu ? 'urdu-text' : 'english-text'}>
          {t('reports.generateReport')} - {reportTypes.find(r => r.type === selectedReportType)?.title}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Start Date"
                value={dateRange.startDate}
                onChange={(newValue) => setDateRange({ ...dateRange, startDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="End Date"
                value={dateRange.endDate}
                onChange={(newValue) => setDateRange({ ...dateRange, endDate: newValue })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReportDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            onClick={() => {
              handleGenerateReport(selectedReportType, 'view');
              setReportDialogOpen(false);
            }}
            variant="contained"
            disabled={generatingReport}
          >
            Generate
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Reports;
