// utils/constants.js

// App Configuration
export const APP_CONFIG = {
  NAME: 'Madrasa Finance Manager',
  VERSION: '2.0.0',
  DEFAULT_CURRENCY: 'Rs',
  DEFAULT_LANGUAGE: 'ur',
  ORGANIZATION_NAME: process.env.REACT_APP_ORGANIZATION_NAME || 'آپ کا مدرسہ'
};

// Firebase Collections
export const COLLECTIONS = {
  USERS: 'users',
  INCOME: 'income',
  EXPENSES: 'expenses',
  STOCK: 'stock',
  ACCOUNTS: 'accounts',
  LOANS: 'loans',
  REPORTS: 'reports',
  SETTINGS: 'settings'
};

// Income Categories
export const INCOME_CATEGORIES = {
  DONATION: 'donation',
  ZAKAT: 'zakat',
  SADAQAH: 'sadaqah',
  FITRANA: 'fitrana',
  QURBANI: 'qurbani',
  FEES: 'fees',
  OTHER: 'other'
};

// Expense Categories
export const EXPENSE_CATEGORIES = {
  SALARIES: 'salaries',
  FOOD: 'food',
  UTILITIES: 'utilities',
  BOOKS: 'books',
  CONSTRUCTION: 'construction',
  EVENTS: 'events',
  TRANSPORT: 'transport',
  OTHER: 'other'
};

// Payment Methods
export const PAYMENT_METHODS = {
  CASH: 'cash',
  BANK: 'bank',
  ONLINE: 'online'
};

// Stock Categories
export const STOCK_CATEGORIES = {
  KITCHEN: 'kitchen',
  BOOKS: 'books',
  STATIONERY: 'stationery',
  CLOTHES: 'clothes',
  FURNITURE: 'furniture',
  OTHER: 'other'
};

// Account Types
export const ACCOUNT_TYPES = {
  CASH: 'cash',
  BANK: 'bank',
  SAVINGS: 'savings'
};

// Loan Types
export const LOAN_TYPES = {
  GIVEN: 'given',
  TAKEN: 'taken'
};

// Status Types
export const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  PENDING: 'pending',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled'
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'dd/MM/yyyy',
  STORAGE: 'yyyy-MM-dd',
  FULL: 'dd/MM/yyyy HH:mm:ss'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [10, 25, 50, 100]
};

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.gif', '.pdf']
};

// WhatsApp Configuration
export const WHATSAPP_CONFIG = {
  API_URL: 'https://graph.facebook.com/v17.0',
  PHONE_NUMBER_ID: process.env.REACT_APP_WHATSAPP_PHONE_NUMBER_ID,
  ACCESS_TOKEN: process.env.REACT_APP_WHATSAPP_API_TOKEN
};

// Report Types
export const REPORT_TYPES = {
  MONTHLY: 'monthly',
  ANNUAL: 'annual',
  CUSTOM: 'custom',
  INCOME: 'income',
  EXPENSE: 'expense',
  DONOR: 'donor'
};
