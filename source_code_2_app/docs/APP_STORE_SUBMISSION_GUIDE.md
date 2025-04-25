# App Store Submission Guide

This guide provides instructions for submitting the Tesco Price Comparison mobile app to both the Google Play Store and Apple App Store.

## Prerequisites

- Apple Developer Account ($99/year)
- Google Play Developer Account ($25 one-time fee)
- App binaries (APK/AAB for Android, IPA for iOS)
- App store assets (icons, screenshots, descriptions)
- Privacy policy URL

## Google Play Store Submission

### Step 1: Prepare App Assets

1. Create the following graphical assets:
   - App icon (512x512 px, PNG)
   - Feature graphic (1024x500 px, PNG)
   - Screenshots (16:9 aspect ratio recommended)
     - At least 2 screenshots (8 maximum)
     - Minimum 320px, maximum 3840px
   - Promo video (YouTube link, optional)

2. Prepare your textual assets:
   - App title (50 characters max)
   - Short description (80 characters max)
   - Full description (4000 characters max)
   - Release notes (500 characters max)

### Step 2: Create App Listing

1. Sign in to your [Google Play Console](https://play.google.com/console/)
2. Click "Create app"
3. Fill in the app details:
   - App name: "Tesco Price Comparison"
   - Default language: English (UK)
   - App or game: App
   - Free or paid: Free (with in-app purchases)
   - Complete the declaration form

4. Navigate to "App content" and fill in:
   - App category: Shopping
   - Email address: your contact email
   - Phone number: your contact phone
   - Website: https://hyrisecrown.com
   - Privacy policy URL: https://hyrisecrown.com/privacy-policy

5. Complete all the required sections under "Store presence":
   - Store listing (add your assets and descriptions)
   - Content rating (complete the questionnaire)
   - Target audience (select appropriate age ranges)
   - News app (select No)

### Step 3: App Release

1. Navigate to "Production" under "Release" in the sidebar
2. Click "Create new release"
3. Upload your AAB or APK file
4. Fill in release notes
5. Roll out to 100% of users
6. Submit for review

## Apple App Store Submission

### Step 1: Prepare App Assets

1. Create the following graphical assets:
   - App icon (1024x1024 px, PNG, no alpha)
   - Screenshots for various devices:
     - iPhone 6.5" (1284x2778 px)
     - iPhone 5.5" (1242x2208 px)
     - iPad Pro (2048x2732 px)
   - App preview videos (optional)

2. Prepare your textual assets:
   - App name (30 characters max)
   - Subtitle (30 characters max)
   - Promotional text (170 characters max)
   - Description (4000 characters max)
   - Keywords (100 characters max, comma-separated)

### Step 2: App Store Connect Setup

1. Sign in to [App Store Connect](https://appstoreconnect.apple.com/)
2. Click "My Apps" then "+" to create a new app
3. Fill in the required details:
   - Platform: iOS
   - App name: "Tesco Price Comparison"
   - Primary language: English (UK)
   - Bundle ID: select the one created in your developer account
   - SKU: a unique ID for your internal use
   - User access: Full Access

4. Click "Create"

### Step 3: Fill App Information

1. In App Store tab, complete all sections:
   - App Information
   - Pricing and Availability
   - App Privacy (privacy policy URL and questionnaire)
   - App Review Information (test account credentials)

2. In the Prepare for Submission section, add:
   - Screenshots and app previews
   - Description, keywords, support URL
   - Marketing URL (optional)
   - Version information

### Step 4: Build Upload and Submission

1. Archive your app in Xcode
2. Use the Organizer in Xcode to upload your build to App Store Connect
3. Wait for the build to process (may take a few hours)
4. In App Store Connect, select the build under "Build" section
5. Click "Submit for Review"
6. Answer the export compliance questions
7. Choose a release type (Automatic or Manual)
8. Submit for review

## Approval Process and Timelines

- **Google Play Store:** Typically 1-3 days for review
- **Apple App Store:** Typically 1-3 days for review, but can take longer

## Common Rejection Reasons and Solutions

### Google Play Store

1. **Privacy Policy Issues**
   - Ensure your privacy policy covers all data collection
   - Include information about user data handling

2. **Metadata Issues**
   - Avoid misleading descriptions
   - Don't use competitors' brand names in keywords

3. **Functionality Issues**
   - Fix all crashes and bugs
   - Ensure app performs as described

### Apple App Store

1. **Guidelines 2.1, 4.2, or 4.3**
   - Ensure app is complete and properly tested
   - Remove any placeholder content

2. **Guideline 5.1.1**
   - Make sure in-app purchases work correctly
   - Don't mention pricing outside the App Store payment system

3. **Privacy-related Issues**
   - Properly disclose data collection in privacy policy
   - Complete App Privacy section accurately

## Post-Submission Updates

After your app is approved:

1. Monitor user reviews and ratings
2. Address issues in periodic updates
3. Keep your app description and screenshots current
4. Plan feature additions for future updates

Remember that each update needs to go through the review process again.