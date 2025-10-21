// pages/Users.js
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
  Avatar
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  AdminPanelSettings as AdminIcon,
  ManageAccounts as ManagerIcon,
  AccountBox as AccountantIcon,
  Visibility as ViewerIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/permissions';
import { MODULES, PERMISSIONS, ROLES } from '../utils/permissions';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

function Users() {
  const { t } = useTranslation();
  const { isUrdu } = useLanguage();
  const { userRole, currentUser } = useAuth();
  const [userData, setUserData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);

  // Demo data
  useEffect(() => {
    setUserData([
      {
        id: 1,
        name: 'Administrator',
        email: 'admin@madrasa.com',
        phone: '+92300123456',
        role: 'admin',
        createdAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 2 * 60 * 60 * 1000)
      },
      {
        id: 2,
        name: 'Finance Manager',
        email: 'manager@madrasa.com',
        phone: '+92301234567',
        role: 'manager',
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 4 * 60 * 60 * 1000)
      },
      {
        id: 3,
        name: 'Accountant',
        email: 'accountant@madrasa.com',
        phone: '+92302345678',
        role: 'accountant',
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 4,
        name: 'Report Viewer',
        email: 'viewer@madrasa.com',
        phone: '+92303456789',
        role: 'viewer',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastLogin: new Date(Date.now() - 48 * 60 * 60 * 1000)
      }
    ]);
  }, []);

  const handleOpen = (user = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        password: ''
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: '',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      
      const newUser = {
        ...formData,
        id: editingUser ? editingUser.id : Date.now(),
        createdAt: editingUser ? editingUser.createdAt : new Date(),
        lastLogin: editingUser ? editingUser.lastLogin : null
      };

      if (editingUser) {
        setUserData(userData.map(item => 
          item.id === editingUser.id ? newUser : item
        ));
        toast.success(t('messages.success.recordUpdated'));
      } else {
        setUserData([...userData, newUser]);
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
    if (window.confirm('Delete this user?')) {
      setUserData(userData.filter(item => item.id !== id));
      toast.success(t('messages.success.recordDeleted'));
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'admin':
        return <AdminIcon />;
      case 'manager':
        return <ManagerIcon />;
      case 'accountant':
        return <AccountantIcon />;
      case 'viewer':
        return <ViewerIcon />;
      default:
        return <PersonIcon />;
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'error';
      case 'manager':
        return 'primary';
      case 'accountant':
        return 'secondary';
      case 'viewer':
        return 'default';
      default:
        return 'default';
    }
  };

  const canCreate = hasPermission(userRole, MODULES.USERS, PERMISSIONS.CREATE);
  const canUpdate = hasPermission(userRole, MODULES.USERS, PERMISSIONS.UPDATE);
  const canDelete = hasPermission(userRole, MODULES.USERS, PERMISSIONS.DELETE);

  if (!hasPermission(userRole, MODULES.USERS, PERMISSIONS.READ)) {
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
          {t('navigation.users')}
        </Typography>
        
        {canCreate && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpen()}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            Add User
          </Button>
        )}
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Users
                  </Typography>
                  <Typography variant="h4" color="primary">
                    {userData.length}
                  </Typography>
                </Box>
                <PersonIcon sx={{ fontSize: 40, color: 'primary.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Admins
                  </Typography>
                  <Typography variant="h4" color="error">
                    {userData.filter(user => user.role === 'admin').length}
                  </Typography>
                </Box>
                <AdminIcon sx={{ fontSize: 40, color: 'error.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Managers
                  </Typography>
                  <Typography variant="h4" color="info.main">
                    {userData.filter(user => user.role === 'manager').length}
                  </Typography>
                </Box>
                <ManagerIcon sx={{ fontSize: 40, color: 'info.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Active Users
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {userData.filter(user => user.lastLogin && 
                      (new Date() - new Date(user.lastLogin)) < 7 * 24 * 60 * 60 * 1000).length}
                  </Typography>
                </Box>
                <ViewerIcon sx={{ fontSize: 40, color: 'success.main' }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Users Table */}
      <Paper sx={{ width: '100%', overflow: 'hidden' }}>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>User</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Last Login</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ mr: 2, bgcolor: getRoleColor(user.role) + '.main' }}>
                        {getRoleIcon(user.role)}
                      </Avatar>
                      <Typography variant="subtitle2">
                        {user.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.email}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {user.phone}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={t(`roles.${user.role}`)} 
                      color={getRoleColor(user.role)}
                      size="small" 
                      className={isUrdu ? 'urdu-text' : 'english-text'}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {format(new Date(user.createdAt), 'dd/MM/yyyy')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    {user.lastLogin ? (
                      <Typography variant="body2">
                        {format(new Date(user.lastLogin), 'dd/MM/yyyy HH:mm')}
                      </Typography>
                    ) : (
                      <Typography variant="body2" color="textSecondary">
                        Never
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {canUpdate && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpen(user)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      )}
                      {canDelete && user.email !== currentUser?.email && (
                        <IconButton 
                          size="small" 
                          onClick={() => handleDelete(user.id)}
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
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle className={isUrdu ? 'urdu-text' : 'english-text'}>
          {editingUser ? 'Edit User' : 'Add User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel className={isUrdu ? 'urdu-text' : 'english-text'}>Role</InputLabel>
                <Select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className={isUrdu ? 'urdu-text' : 'english-text'}
                >
                  {Object.values(ROLES).map(role => (
                    <MenuItem key={role} value={role}>
                      <span className={isUrdu ? 'urdu-text' : 'english-text'}>
                        {t(`roles.${role}`)}
                      </span>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label={editingUser ? "New Password (leave empty to keep current)" : "Password"}
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!editingUser}
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
            disabled={loading || !formData.name || !formData.email || !formData.role || (!editingUser && !formData.password)}
            className={isUrdu ? 'urdu-text' : 'english-text'}
          >
            {loading ? t('common.loading') : t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Users;
