# Firebase Configuration

## Initial Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Click "Add project"
3. Name your project (e.g., "madrasa-finance-manager")
4. Enable Google Analytics (optional)
5. Create project

### 2. Enable Authentication
1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password"
5. Optionally enable "Email link (passwordless sign-in)"

### 3. Setup Firestore Database
1. Go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select your region
5. Click "Done"

### 4. Enable Storage
1. Go to "Storage"
2. Click "Get started"
3. Keep default security rules for now
4. Choose your region
5. Click "Done"

### 5. Setup Hosting (Optional)
1. Go to "Hosting"
2. Click "Get started"
3. Install Firebase CLI: `npm install -g firebase-tools`
4. Run `firebase init hosting` in your project
5. Follow the setup wizard

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Role-based access for financial data
    match /income/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager', 'accountant']);
    }
    
    match /expenses/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager', 'accountant']);
    }
    
    match /stock/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager']);
    }
    
    match /reports/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager']);
    }
    
    match /accounts/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager']);
    }
    
    match /loans/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
        (getUserRole(request.auth.uid) in ['admin', 'manager']);
    }
    
    // Helper function to get user role
    function getUserRole(uid) {
      return get(/databases/$(database)/documents/users/$(uid)).data.role;
    }
  }
}
```

## Storage Security Rules

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload bills and receipts
    match /bills/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    match /receipts/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
    
    match /reports/{allPaths=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Environment Variables

Create a `.env` file in your project root:

```env
# Firebase Configuration
REACT_APP_FIREBASE_API_KEY=your_api_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456

# WhatsApp Integration (Optional)
REACT_APP_WHATSAPP_API_TOKEN=your_whatsapp_token
REACT_APP_WHATSAPP_PHONE_NUMBER_ID=your_phone_number_id

# App Configuration
REACT_APP_DEFAULT_LANGUAGE=ur
REACT_APP_CURRENCY_SYMBOL=Rs
REACT_APP_ORGANIZATION_NAME=آپ کا مدرسہ
```

## Initial Data Setup

### Create Admin User

1. Register the first user through your app
2. In Firestore Console, create a document in `users` collection:

```json
{
  "email": "admin@madrasa.com",
  "name": "Administrator",
  "role": "admin",
  "phone": "+92300123456",
  "createdAt": "2024-10-21T00:00:00.000Z"
}
```

### Sample Categories

Create these collections with sample data:

#### Income Categories
```json
// income_categories collection
{
  "donation": { "name_en": "General Donation", "name_ur": "عام عطیہ" },
  "zakat": { "name_en": "Zakat", "name_ur": "زکوٰۃ" },
  "sadaqah": { "name_en": "Sadaqah", "name_ur": "صدقہ" },
  "fitrana": { "name_en": "Fitrana", "name_ur": "فطرانہ" },
  "qurbani": { "name_en": "Qurbani Fund", "name_ur": "قربانی فنڈ" },
  "fees": { "name_en": "Student Fees", "name_ur": "طلباء کی فیس" }
}
```

#### Expense Categories
```json
// expense_categories collection
{
  "salaries": { "name_en": "Teachers' Salaries", "name_ur": "اساتذہ کی تنخواہ" },
  "food": { "name_en": "Students' Food", "name_ur": "طلباء کا کھانا" },
  "utilities": { "name_en": "Utility Bills", "name_ur": "یوٹیلٹی بلز" },
  "books": { "name_en": "Books & Stationery", "name_ur": "کتابیں اور اسٹیشنری" },
  "construction": { "name_en": "Construction & Repair", "name_ur": "تعمیر اور مرمت" },
  "events": { "name_en": "Events & Ceremonies", "name_ur": "تقریبات اور تہوار" }
}
```

## Firebase CLI Commands

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init

# Deploy to hosting
firebase deploy

# Deploy only functions
firebase deploy --only functions

# Deploy only hosting
firebase deploy --only hosting

# Serve locally
firebase serve
```

## Monitoring and Analytics

1. **Performance Monitoring**
   - Go to "Performance" in Firebase Console
   - Add performance monitoring SDK
   - Monitor app performance metrics

2. **Analytics**
   - Enable Google Analytics
   - Track user engagement
   - Monitor conversion events

3. **Crashlytics**
   - Add Crashlytics SDK
   - Monitor app crashes
   - Get detailed crash reports

## Backup Strategy

1. **Automated Backups**
   - Set up Cloud Functions for scheduled backups
   - Export Firestore data regularly
   - Store backups in Cloud Storage

2. **Manual Backup**
   ```bash
   # Export Firestore data
   gcloud firestore export gs://your-bucket-name
   ```

## Cost Optimization

1. **Firestore**
   - Use compound queries efficiently
   - Implement pagination
   - Delete unnecessary old data

2. **Storage**
   - Compress images before upload
   - Set up lifecycle rules
   - Monitor storage usage

3. **Functions**
   - Optimize function execution time
   - Use appropriate memory allocation
   - Monitor function invocations

## Troubleshooting

### Common Issues

1. **Permission Denied**
   - Check Firestore security rules
   - Verify user authentication
   - Confirm user role permissions

2. **Network Errors**
   - Check internet connectivity
   - Verify Firebase configuration
   - Monitor Firebase status

3. **Upload Failures**
   - Check file size limits
   - Verify storage rules
   - Check file format support
