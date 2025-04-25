# Tesco Price Comparison Mobile App Architecture

This document outlines the architecture and technical details of the Tesco Price Comparison mobile applications.

## Technology Stack

- **Framework**: React Native
- **Language**: TypeScript
- **State Management**: React Context API + React Query
- **Networking**: Axios
- **Offline Storage**: AsyncStorage + SQLite
- **Navigation**: React Navigation
- **UI Components**: React Native Paper
- **Analytics**: Firebase Analytics
- **Push Notifications**: Firebase Cloud Messaging
- **Authentication**: Firebase Authentication
- **Payment Processing**: Stripe SDK

## Architecture Overview

The Tesco Price Comparison mobile app follows a feature-based architecture with clean separation of concerns:

```
/mobile-app
├── src/
│   ├── api/                 # API integration layer
│   ├── assets/              # Images, fonts, and other static assets
│   ├── components/          # Reusable UI components
│   ├── constants/           # App constants and configuration
│   ├── contexts/            # React Context providers
│   ├── features/            # Feature-specific code
│   │   ├── auth/            # Authentication feature
│   │   ├── comparison/      # Price comparison feature
│   │   ├── products/        # Product browsing feature
│   │   ├── scanner/         # Barcode scanner feature
│   │   ├── savings/         # Savings challenge feature
│   │   └── settings/        # App settings feature
│   ├── hooks/               # Custom React hooks
│   ├── navigation/          # Navigation setup and screens
│   ├── services/            # Service layer (analytics, notifications, etc.)
│   ├── theme/               # Theming and styling
│   ├── types/               # TypeScript type definitions
│   ├── utils/               # Utility functions
│   └── App.tsx              # Main application component
└── index.js                 # Entry point
```

## Data Flow

The app follows a unidirectional data flow pattern:

1. **User Interaction**: User interacts with a component
2. **Action**: Component triggers an action (API call, state update)
3. **Data Processing**: Action is processed by a service or API call
4. **State Update**: Context or query cache is updated with new data
5. **UI Update**: Components re-render with updated data

## Key Features Implementation

### 1. Authentication

The app uses Firebase Authentication for user management:

```typescript
// Example implementation in src/features/auth/authService.ts
import auth from '@react-native-firebase/auth';

export const signIn = async (email: string, password: string) => {
  try {
    const userCredential = await auth().signInWithEmailAndPassword(email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(`Authentication failed: ${error.message}`);
  }
};
```

### 2. Real-time Price Updates

The app uses WebSockets for real-time price updates:

```typescript
// Example implementation in src/services/websocketService.ts
import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export const useWebSocketConnection = (url: string, onMessage: (data: any) => void) => {
  const wsRef = useRef<WebSocket | null>(null);
  
  const connect = () => {
    wsRef.current = new WebSocket(url);
    
    wsRef.current.onopen = () => {
      console.log('WebSocket connected');
    };
    
    wsRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      onMessage(data);
    };
    
    wsRef.current.onerror = (error) => {
      console.error('WebSocket error:', error);
    };
    
    wsRef.current.onclose = () => {
      console.log('WebSocket disconnected');
      // Attempt to reconnect after a delay
      setTimeout(connect, 5000);
    };
  };
  
  useEffect(() => {
    connect();
    
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'active' && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
        connect();
      }
    };
    
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    
    return () => {
      subscription.remove();
      wsRef.current?.close();
    };
  }, [url]);
};
```

### 3. Barcode Scanner

Integration with device camera for barcode scanning:

```typescript
// Example implementation in src/features/scanner/BarcodeScanner.tsx
import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Camera } from 'react-native-camera-kit';
import { useNavigation } from '@react-navigation/native';
import { fetchProductByBarcode } from '../../api/products';

export const BarcodeScanner = () => {
  const [scanning, setScanning] = useState(true);
  const navigation = useNavigation();

  const onBarcodeScan = async (event) => {
    if (!scanning) return;
    
    setScanning(false);
    const barcode = event.nativeEvent.codeStringValue;
    
    try {
      const product = await fetchProductByBarcode(barcode);
      navigation.navigate('ProductDetails', { product });
    } catch (error) {
      console.error('Error fetching product:', error);
      setScanning(true);
    }
  };

  return (
    <View style={styles.container}>
      <Camera
        style={styles.scanner}
        scanBarcode={true}
        onReadCode={onBarcodeScan}
        showFrame={true}
        laserColor="red"
        frameColor="white"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scanner: {
    flex: 1,
  },
});
```

### 4. Offline Support

The app implements offline support using a combination of AsyncStorage and SQLite:

```typescript
// Example implementation in src/services/offlineStorage.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import SQLite from 'react-native-sqlite-storage';

// Configure SQLite
SQLite.enablePromise(true);
const DB_NAME = 'tesco_comparison.db';

// Initialize database
export const initDatabase = async () => {
  try {
    const db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    
    // Create tables if they don't exist
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY,
        name TEXT,
        description TEXT,
        image_url TEXT,
        category_id INTEGER,
        barcode TEXT,
        last_updated INTEGER
      )
    `);
    
    await db.executeSql(`
      CREATE TABLE IF NOT EXISTS prices (
        id INTEGER PRIMARY KEY,
        product_id INTEGER,
        store_id INTEGER,
        price REAL,
        currency TEXT,
        last_updated INTEGER,
        FOREIGN KEY (product_id) REFERENCES products (id)
      )
    `);
    
    return db;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Save product to offline storage
export const saveProductOffline = async (product) => {
  try {
    const db = await SQLite.openDatabase({ name: DB_NAME, location: 'default' });
    
    await db.executeSql(
      `INSERT OR REPLACE INTO products 
       (id, name, description, image_url, category_id, barcode, last_updated) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        product.id,
        product.name,
        product.description,
        product.imageUrl,
        product.categoryId,
        product.barcode,
        Date.now()
      ]
    );
    
    // Also save to AsyncStorage for quicker access
    await AsyncStorage.setItem(`product_${product.id}`, JSON.stringify(product));
    
    return true;
  } catch (error) {
    console.error('Error saving product offline:', error);
    return false;
  }
};
```

### 5. Push Notifications

The app uses Firebase Cloud Messaging (FCM) for push notifications:

```typescript
// Example implementation in src/services/notificationService.ts
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { registerDeviceToken } from '../api/user';

export const initializeNotifications = async () => {
  // Request permission (iOS only)
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled = 
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      
    if (!enabled) {
      console.log('User notification permissions denied');
      return false;
    }
  }
  
  // Get FCM token
  const token = await messaging().getToken();
  if (token) {
    // Register token with backend
    await registerDeviceToken(token);
    console.log('FCM Token registered:', token);
  }
  
  // Listen for token refresh
  messaging().onTokenRefresh(async (newToken) => {
    await registerDeviceToken(newToken);
    console.log('FCM Token refreshed:', newToken);
  });
  
  // Set up notification handlers
  messaging().onMessage(async (remoteMessage) => {
    console.log('Foreground notification received:', remoteMessage);
    // Handle the message
  });
  
  // When the app is in the background
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Background notification received:', remoteMessage);
    // Handle the message
  });
  
  return true;
};
```

### 6. Multi-language Support

The app implements internationalization using i18next:

```typescript
// Example implementation in src/services/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'react-native-localize';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Import language resources
import en from '../locales/en.json';
import fr from '../locales/fr.json';
import de from '../locales/de.json';
import it from '../locales/it.json';
import es from '../locales/es.json';
import sw from '../locales/sw.json'; // Swahili for East African countries

const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback) => {
    // Try to get user selected language from storage
    const savedLanguage = await AsyncStorage.getItem('user-language');
    if (savedLanguage) {
      return callback(savedLanguage);
    }
    
    // If no language is saved, detect based on device
    const deviceLanguage = getLocales()[0].languageCode;
    callback(deviceLanguage);
  },
  init: () => {},
  cacheUserLanguage: async (language) => {
    await AsyncStorage.setItem('user-language', language);
  }
};

// Initialize i18next
i18n
  .use(LANGUAGE_DETECTOR)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      fr: { translation: fr },
      de: { translation: de },
      it: { translation: it },
      es: { translation: es },
      sw: { translation: sw }
    },
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;
```

## Performance Optimization Techniques

1. **Memoization**: Using React.memo() and useMemo() to prevent unnecessary re-renders
2. **Image Optimization**: Caching and resize images on-demand
3. **Lazy Loading**: Import components and screens only when needed
4. **Virtual Lists**: Using FlatList and SectionList for efficient list rendering
5. **Background Processing**: Offload heavy tasks to separate threads
6. **API Request Batching**: Group API requests to reduce network calls
7. **Query Caching**: Cache API responses with React Query
8. **Code Splitting**: Split code into smaller chunks
9. **Native Modules**: Use native modules for performance-critical features

## Security Implementation

1. **Secure Storage**: Sensitive data is stored using secure storage
2. **API Authentication**: JWT tokens with periodic rotation
3. **Certificate Pinning**: Prevent man-in-the-middle attacks
4. **App Transport Security**: Enforce HTTPS connections
5. **Code Obfuscation**: Protect app code from reverse engineering
6. **Biometric Authentication**: Support for fingerprint/Face ID
7. **Session Management**: Automatic session timeout
8. **Input Validation**: Validate all user inputs

## Testing Strategy

The mobile app is tested using:

1. **Unit Tests**: Testing individual functions and hooks
2. **Component Tests**: Testing UI components
3. **Integration Tests**: Testing feature workflows
4. **E2E Tests**: Testing complete user journeys
5. **Performance Tests**: Monitoring app performance metrics
6. **Security Tests**: Regular security audits

## CI/CD Pipeline

The app uses a continuous integration and deployment pipeline:

1. **Code Linting**: ESLint for code quality
2. **Type Checking**: TypeScript for type checking
3. **Unit Testing**: Jest for automated tests
4. **Build Generation**: Automated builds for both platforms
5. **Beta Distribution**: TestFlight and Firebase App Distribution
6. **Production Deployment**: Automated submission to app stores

## Version Compatibility

The app is designed to support:

- **iOS**: Version 12.0 and above
- **Android**: API Level 21 (Android 5.0) and above