// pages/Dashboard.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS } from '../utils/permissions';
import { format } from 'date-fns';

function Dashboard() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    totalIncome: 0,
    totalExpenses: 0,
    currentBalance: 0,
    monthlyIncome: 0,
    monthlyExpenses: 0,
    recentTransactions: [],
    monthlyChart: []
  });
  const [loading, setLoading] = useState(true);

  // Demo data for development
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setDashboardData({
        totalIncome: 1250000,
        totalExpenses: 850000,
        currentBalance: 400000,
        monthlyIncome: 125000,
        monthlyExpenses: 85000,
        recentTransactions: [
          {
            id: 1,
            type: 'income',
            category: 'donation',
            amount: 25000,
            description: 'Monthly donation from Ahmad Ali',
            date: new Date(),
            donor: 'Ahmad Ali'
          },
          {
            id: 2,
            type: 'expense',
            category: 'salaries',
            amount: 15000,
            description: 'Teacher salary payment',
            date: new Date(Date.now() - 86400000)
          },
          {
            id: 3,
            type: 'income',
            category: 'zakat',
            amount: 50000,
            description: 'Zakat collection',
            date: new Date(Date.now() - 172800000),
            donor: 'Multiple donors'
          }
        ],
        monthlyChart: [
          { month: 'Jan', income: 120000, expenses: 80000 },
          { month: 'Feb', income: 150000, expenses: 90000 },
          { month: 'Mar', income: 100000, expenses: 85000 },
          { month: 'Apr', income: 180000, expenses: 95000 },
          { month: 'May', income: 125000, expenses: 85000 },
          { month: 'Jun', income: 135000, expenses: 88000 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  const StatCard = ({ title, value, icon, color, change }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <Box>
            <Typography 
              color="textSecondary" 
              gutterBottom 
              variant="subtitle2"
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {title}
            </Typography>
            <Typography 
              variant="h4" 
              sx={{ fontWeight: 'bold', color: color }}
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('common.currency')} {value?.toLocaleString()}
            </Typography>
            {change && (
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                {change > 0 ? (
                  <TrendingUp sx={{ color: 'success.main', mr: 0.5 }} fontSize="small" />
                ) : (
                  <TrendingDown sx={{ color: 'error.main', mr: 0.5 }} fontSize="small" />
                )}
                <Typography 
                  variant="body2" 
                  sx={{ color: change > 0 ? 'success.main' : 'error.main' }}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  {Math.abs(change)}% {t('dashboard.thisMonth')}
                </Typography>
              </Box>
            )}
          </Box>
          <Box sx={{ 
            bgcolor: `${color}.light`, 
            borderRadius: 2, 
            p: 1,
            color: `${color}.main`
          }}>
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const QuickActionCard = ({ title, description, onClick, icon, disabled = false }) => (
    <Card sx={{ 
      height: '100%', 
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? 0.6 : 1,
      '&:hover': disabled ? {} : {
        transform: 'translateY(-2px)',
        boxShadow: 3
      },
      transition: 'all 0.2s'
    }}>
      <CardContent onClick={disabled ? undefined : onClick}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
          <Box sx={{ 
            bgcolor: 'primary.light', 
            borderRadius: '50%', 
            p: 2, 
            mb: 2,
            color: 'white'
          }}>
            {icon}
          </Box>
          <Typography 
            variant="h6" 
            gutterBottom
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {title}
          </Typography>
          <Typography 
            variant="body2" 
            color="textSecondary"
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {description}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
          {t('common.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography 
          variant="h4" 
          sx={{ fontWeight: 'bold' }}
          className={isUrdu ? 'urdu-text' : 'english-text'}
        >
          {t('dashboard.welcome')}
        </Typography>
        <IconButton onClick={() => window.location.reload()}>
          <RefreshIcon />
        </IconButton>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.totalIncome')}
            value={dashboardData.totalIncome}
            icon={<TrendingUp />}
            color="success"
            change={12}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.totalExpenses')}
            value={dashboardData.totalExpenses}
            icon={<TrendingDown />}
            color="error"
            change={-5}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={t('dashboard.currentBalance')}
            value={dashboardData.currentBalance}
            icon={<AccountBalance />}
            color="primary"
            change={8}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title={`${t('dashboard.thisMonth')} ${t('navigation.income')}`}
            value={dashboardData.monthlyIncome}
            icon={<TrendingUp />}
            color="info"
            change={15}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Monthly Overview Chart */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('dashboard.monthlyOverview')}
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dashboardData.monthlyChart}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [`${t('common.currency')} ${value.toLocaleString()}`, '']} />
                <Bar dataKey="income" fill="#22c55e" name={t('navigation.income')} />
                <Bar dataKey="expenses" fill="#ef4444" name={t('navigation.expenses')} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Quick Actions */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 400 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('dashboard.quickActions')}
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <QuickActionCard
                  title={t('income.addIncome')}
                  description="Add new donation"
                  icon={<AddIcon />}
                  onClick={() => window.location.href = '/income'}
                  disabled={!hasPermission(userRole, MODULES.INCOME, PERMISSIONS.CREATE)}
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard
                  title={t('expenses.addExpense')}
                  description="Record expense"
                  icon={<AddIcon />}
                  onClick={() => window.location.href = '/expenses'}
                  disabled={!hasPermission(userRole, MODULES.EXPENSES, PERMISSIONS.CREATE)}
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard
                  title={t('reports.generateReport')}
                  description="Monthly report"
                  icon={<AddIcon />}
                  onClick={() => window.location.href = '/reports'}
                  disabled={!hasPermission(userRole, MODULES.REPORTS, PERMISSIONS.READ)}
                />
              </Grid>
              <Grid item xs={6}>
                <QuickActionCard
                  title="View Accounts"
                  description="Bank & cash"
                  icon={<AccountBalance />}
                  onClick={() => window.location.href = '/accounts'}
                  disabled={!hasPermission(userRole, MODULES.ACCOUNTS, PERMISSIONS.READ)}
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Transactions */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography 
              variant="h6" 
              gutterBottom
              className={isUrdu ? 'urdu-text' : 'english-text'}
            >
              {t('dashboard.recentTransactions')}
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                      {t('common.date')}
                    </TableCell>
                    <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                      {t('common.description')}
                    </TableCell>
                    <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                      {t('common.category')}
                    </TableCell>
                    <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                      {t('common.amount')}
                    </TableCell>
                    <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                      Type
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {dashboardData.recentTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {format(transaction.date, 'dd/MM/yyyy')}
                      </TableCell>
                      <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {transaction.description}
                        {transaction.donor && (
                          <Typography variant="caption" display="block" color="textSecondary">
                            {transaction.donor}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t(`${transaction.type}.categories.${transaction.category}`)}
                      </TableCell>
                      <TableCell className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t('common.currency')} {transaction.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={transaction.type === 'income' ? t('navigation.income') : t('navigation.expenses')}
                          color={transaction.type === 'income' ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

export default Dashboard;
