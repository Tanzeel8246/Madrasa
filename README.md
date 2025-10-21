# 🕌 Madrasa Finance Manager

**Complete Bilingual Financial Management System for Islamic Seminaries**

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/Firebase-10.1.0-orange.svg)](https://firebase.google.com/)
[![Material-UI](https://img.shields.io/badge/Material--UI-5.14.1-green.svg)](https://mui.com/)
[![i18next](https://img.shields.io/badge/i18next-23.2.11-yellow.svg)](https://www.i18next.com/)

## 🌟 Overview

Madrasa Finance Manager is a comprehensive financial management application designed specifically for Islamic seminaries (madrasas). It provides complete income/expense tracking, receipt generation, stock management, and reporting features with full bilingual support (Urdu/English).

## ✨ Key Features

### 📊 **Financial Management**
- **Income Tracking**: Donations, Zakat, Sadaqah, Fitrana, fees with donor management
- **Expense Management**: Categorized expenses with bill attachments
- **Receipt Generation**: Auto-generated PDF receipts with WhatsApp sharing
- **Reports**: Monthly/Annual reports with professional Urdu fonts

### 👥 **User Management & Roles**
- **Admin**: Full system access
- **Manager**: Income/expense management + reports
- **Accountant**: Income/expense entry only
- **Viewer**: Read-only access to reports

### 🏪 **Inventory & Assets**
- **Stock Management**: Kitchen items, books, stationery with alerts
- **Account Management**: Multiple bank accounts and cash tracking
- **Loan Management**: Track loans given/taken with due date reminders

### 🌐 **Localization & UI**
- **Bilingual Interface**: Complete Urdu/English toggle
- **RTL Support**: Proper right-to-left layout for Urdu
- **Islamic Theme**: Green and gold color scheme
- **Responsive Design**: Works on desktop and mobile

### 📱 **Integration Features**
- **PDF Generation**: Professional receipts and reports
- **WhatsApp Integration**: Share receipts and reports
- **Firebase Backend**: Real-time data sync and authentication
- **File Upload**: Bill attachments with cloud storage

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd madrasa-manage-kit
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Firebase Setup**
   - Create a new Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Enable Storage
   - Copy your Firebase config

4. **Environment Configuration**
   ```bash
   cp .env.example .env
   ```
   
   Update `.env` with your Firebase configuration:
   ```env
   REACT_APP_FIREBASE_API_KEY=your_api_key_here
   REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=your_project_id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

5. **Start the development server**
   ```bash
   npm start
   # or
   yarn start
   ```

6. **Access the application**
   - Open [http://localhost:3000](http://localhost:3000)
   - Use demo credentials provided on login page

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@madrasa.com | admin123 |
| Manager | manager@madrasa.com | manager123 |
| Accountant | accountant@madrasa.com | accountant123 |
| Viewer | viewer@madrasa.com | viewer123 |

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Layout.js       # Main layout with sidebar
│   └── ProtectedRoute.js # Authentication guard
├── contexts/           # React Context providers
│   ├── AuthContext.js  # Authentication state
│   └── LanguageContext.js # Language switching
├── pages/              # Main application pages
│   ├── Dashboard.js    # Main dashboard
│   ├── Income.js       # Income management
│   ├── Expenses.js     # Expense management
│   ├── Stock.js        # Inventory management
│   ├── Reports.js      # Report generation
│   ├── Accounts.js     # Bank/cash accounts
│   ├── Loans.js        # Loan management
│   ├── Users.js        # User management
│   └── Settings.js     # Application settings
├── locales/            # Translation files
│   ├── en.json         # English translations
│   └── ur.json         # Urdu translations
├── utils/              # Utility functions
│   ├── constants.js    # App constants
│   ├── permissions.js  # Role-based permissions
│   ├── pdfGenerator.js # PDF creation utilities
│   └── whatsappIntegration.js # WhatsApp sharing
├── firebase.js         # Firebase configuration
├── i18n.js            # Internationalization setup
└── App.js             # Main application component
```

## 🔧 Configuration

### Firebase Security Rules

Firestore rules example:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only access their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Income/Expenses/etc. - role-based access
    match /{collection=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### WhatsApp Integration Setup

1. Get WhatsApp Business API access
2. Update environment variables:
   ```env
   REACT_APP_WHATSAPP_API_TOKEN=your_token
   REACT_APP_WHATSAPP_PHONE_NUMBER_ID=your_phone_id
   ```

## 📱 Deployment

### Firebase Hosting

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Install Firebase CLI**
   ```bash
   npm install -g firebase-tools
   ```

3. **Initialize Firebase hosting**
   ```bash
   firebase init hosting
   ```

4. **Deploy**
   ```bash
   firebase deploy
   ```

### Other Hosting Options
- **Netlify**: Connect GitHub repo for auto-deployment
- **Vercel**: Import project from Git
- **Traditional Web Hosting**: Upload `build` folder contents

## 🎨 Customization

### Changing Theme Colors
Edit `src/App.js` theme configuration:
```javascript
const theme = createTheme({
  palette: {
    primary: {
      main: '#16a34a', // Your primary color
    },
    secondary: {
      main: '#f59e0b', // Your secondary color
    },
  },
});
```

### Adding New Languages
1. Create new translation file in `src/locales/`
2. Update `src/i18n.js` to include new language
3. Add language toggle option in components

### Custom PDF Templates
Modify `src/utils/pdfGenerator.js` to customize receipt/report layouts.

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

## 🐛 Troubleshooting

### Common Issues

1. **Firebase Connection Error**
   - Verify `.env` configuration
   - Check Firebase project settings
   - Ensure authentication is enabled

2. **Urdu Text Not Displaying**
   - Check font loading in browser
   - Verify CSS classes are applied
   - Clear browser cache

3. **PDF Generation Issues**
   - Ensure all required fonts are loaded
   - Check browser compatibility
   - Verify jsPDF configuration

4. **WhatsApp Sharing Not Working**
   - Verify API credentials
   - Check phone number format
   - Test API endpoint accessibility

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Email: [your-email@domain.com]
- Documentation: [link-to-docs]

## 🙏 Acknowledgments

- Islamic design principles and color schemes
- Material-UI for excellent React components
- Firebase for backend infrastructure
- i18next for internationalization support
- React community for amazing tools and libraries

---

**Made with ❤️ for the Islamic community**

الحمد لله رب العالمين
