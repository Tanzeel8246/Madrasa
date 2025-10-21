// components/Layout.js
import React, { useState } from 'react';
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  List,
  Typography,
  Divider,
  IconButton,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Avatar,
  Menu,
  MenuItem,
  Switch,
  FormControlLabel
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AttachMoney as IncomeIcon,
  Money as ExpenseIcon,
  Inventory as StockIcon,
  Assessment as ReportsIcon,
  AccountBalance as AccountsIcon,
  LocalAtm as LoansIcon,
  People as UsersIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Language as LanguageIcon,
  AccountCircle
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { canAccessModule } from '../utils/permissions';

const drawerWidth = 280;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { currentUser, userRole, logout } = useAuth();
  const { toggleLanguage, isUrdu } = useLanguage();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
    handleClose();
  };

  const menuItems = [
    {
      text: t('navigation.dashboard'),
      icon: <DashboardIcon />,
      path: '/dashboard',
      module: 'dashboard'
    },
    {
      text: t('navigation.income'),
      icon: <IncomeIcon />,
      path: '/income',
      module: 'income'
    },
    {
      text: t('navigation.expenses'),
      icon: <ExpenseIcon />,
      path: '/expenses',
      module: 'expenses'
    },
    {
      text: t('navigation.stock'),
      icon: <StockIcon />,
      path: '/stock',
      module: 'stock'
    },
    {
      text: t('navigation.reports'),
      icon: <ReportsIcon />,
      path: '/reports',
      module: 'reports'
    },
    {
      text: t('navigation.accounts'),
      icon: <AccountsIcon />,
      path: '/accounts',
      module: 'accounts'
    },
    {
      text: t('navigation.loans'),
      icon: <LoansIcon />,
      path: '/loans',
      module: 'loans'
    },
    {
      text: t('navigation.users'),
      icon: <UsersIcon />,
      path: '/users',
      module: 'users'
    },
    {
      text: t('navigation.settings'),
      icon: <SettingsIcon />,
      path: '/settings',
      module: 'settings'
    }
  ];

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ p: 2, textAlign: 'center', bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h6" className={isUrdu ? 'urdu-text' : 'english-text'}>
          {t('app.title')}
        </Typography>
        <Typography variant="caption" className={isUrdu ? 'urdu-text' : 'english-text'}>
          {t('app.subtitle')}
        </Typography>
      </Box>
      
      <Divider />
      
      <List sx={{ flex: 1 }}>
        {menuItems.map((item) => {
          // Check if user has access to this module
          if (item.module !== 'dashboard' && !canAccessModule(userRole, item.module)) {
            return null;
          }
          
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={isActive}
                onClick={() => navigate(item.path)}
                sx={{
                  '&.Mui-selected': {
                    backgroundColor: 'primary.light',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.main',
                    },
                  },
                }}
              >
                <ListItemIcon sx={{ color: isActive ? 'white' : 'inherit' }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.text} 
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
      
      <Divider />
      
      <Box sx={{ p: 2 }}>
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
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {/* Page title can be added here */}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="body2" className={isUrdu ? 'urdu-text' : 'english-text'}>
              {t(`roles.${userRole}`)}
            </Typography>
            
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenu}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main' }}>
                {currentUser?.email?.charAt(0).toUpperCase()}
              </Avatar>
            </IconButton>
            
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleClose}
            >
              <MenuItem onClick={handleClose}>
                <AccountCircle sx={{ mr: 1 }} />
                <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {currentUser?.email}
                </Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <LogoutIcon sx={{ mr: 1 }} />
                <Typography className={isUrdu ? 'urdu-text' : 'english-text'}>
                  {t('navigation.logout')}
                </Typography>
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: 8
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export default Layout;
