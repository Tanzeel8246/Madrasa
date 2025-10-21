// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // User roles and permissions
  const rolePermissions = {
    admin: {
      income: ['create', 'read', 'update', 'delete'],
      expenses: ['create', 'read', 'update', 'delete'],
      reports: ['create', 'read', 'update', 'delete'],
      users: ['create', 'read', 'update', 'delete'],
      settings: ['create', 'read', 'update', 'delete']
    },
    manager: {
      income: ['create', 'read', 'update'],
      expenses: ['create', 'read', 'update'],
      reports: ['create', 'read'],
      users: ['read'],
      settings: ['read']
    },
    accountant: {
      income: ['create', 'read', 'update'],
      expenses: ['create', 'read', 'update'],
      reports: ['read'],
      users: [],
      settings: []
    },
    viewer: {
      income: ['read'],
      expenses: ['read'],
      reports: ['read'],
      users: [],
      settings: []
    }
  };

  async function login(email, password) {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await fetchUserRole(result.user.uid);
    return result;
  }

  async function register(email, password, userData) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    // Create user document with role
    await setDoc(doc(db, 'users', result.user.uid), {
      email,
      role: userData.role || 'viewer',
      name: userData.name || '',
      phone: userData.phone || '',
      createdAt: new Date().toISOString()
    });
    await fetchUserRole(result.user.uid);
    return result;
  }

  async function logout() {
    setUserRole(null);
    return signOut(auth);
  }

  async function fetchUserRole(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        setUserRole(userDoc.data().role || 'viewer');
      } else {
        setUserRole('viewer');
      }
    } catch (error) {
      console.error('Error fetching user role:', error);
      setUserRole('viewer');
    }
  }

  function hasPermission(module, action) {
    if (!userRole) return false;
    const permissions = rolePermissions[userRole];
    return permissions && permissions[module] && permissions[module].includes(action);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await fetchUserRole(user.uid);
      } else {
        setUserRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userRole,
    rolePermissions,
    login,
    register,
    logout,
    hasPermission
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
