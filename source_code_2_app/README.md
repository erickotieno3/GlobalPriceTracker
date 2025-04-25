# Tesco Price Comparison Mobile App Source Code

This folder contains all the source code for the Tesco Price Comparison mobile applications for Android and iOS.

## Folder Structure

- `/mobile-app` - Core mobile application code
- `/api-integration` - API integration code for connecting to backend services
- `/assets` - Image assets, icons, and other resources

## Setup Instructions

### Prerequisites
- Node.js v18+
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- CocoaPods (for iOS dependencies)

### Steps
1. Clone this repository
2. Run `npm install` in the root directory
3. For iOS: 
   - Navigate to the `ios` folder: `cd ios`
   - Install CocoaPods dependencies: `pod install`
   - Return to root: `cd ..`
4. Create a `.env` file with API endpoints and keys:
   ```
   API_BASE_URL=https://api.yourdomain.com
   STRIPE_PUBLIC_KEY=your_stripe_public_key
   ```
5. Start the development server:
   - For Android: `npm run android`
   - For iOS: `npm run ios`

## Building for Production

### Android
1. Update the version in `android/app/build.gradle`
2. Generate a signed APK/AAB:
   ```
   cd android
   ./gradlew bundleRelease
   ```
3. The AAB file will be in `android/app/build/outputs/bundle/release/`

### iOS
1. Update the version in Xcode
2. Archive the app in Xcode
3. Upload to App Store Connect

## Features

- Real-time price comparison
- Barcode scanning for product lookup
- Push notifications for price alerts
- Offline mode with data syncing
- Multi-language support
- Social media sharing
- User accounts and favorites
- Savings challenge tracking
- Payment processing integration

## API Integration

The app communicates with the backend API through RESTful endpoints and WebSocket connections. See `/api-integration` for implementation details.