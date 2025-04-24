/**
 * Admin Authentication Routes
 * 
 * This file contains routes for admin authentication, including:
 * - Login
 * - Two-Factor Authentication
 * - Session management
 */

import { Router, Request, Response } from 'express';
import { sendVerificationCode, verifyCode } from './email-service';

// Create a router
const adminRouter = Router();

// Hardcoded admin credentials (in production, use a database)
const ADMIN_CREDENTIALS = {
  email: 'admin@tesco-compare.com',
  password: 'Tesco-Admin-2023!',
  name: 'Admin User'
};

// Store sessions (in memory for development, use Redis/database in production)
const adminSessions: Map<string, {
  email: string;
  authenticated: boolean;
  lastActivity: Date;
}> = new Map();

/**
 * Admin Login Route
 * First factor authentication (username/password)
 */
adminRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Validate inputs
  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  // Check if credentials match (in production, use bcrypt.compare)
  if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  try {
    // Generate and send verification code via email
    await sendVerificationCode(email, ADMIN_CREDENTIALS.name);

    // Create a session
    const sessionId = generateSessionId();
    adminSessions.set(sessionId, {
      email,
      authenticated: false, // Not fully authenticated until 2FA is complete
      lastActivity: new Date()
    });

    // Set session cookie
    res.cookie('adminSessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 60 * 1000 // 30 minutes
    });

    return res.status(200).json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Admin login error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
});

/**
 * Send 2FA Verification Code
 */
adminRouter.post('/send-verification', async (req: Request, res: Response) => {
  const { email } = req.body;

  if (email !== ADMIN_CREDENTIALS.email) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  try {
    await sendVerificationCode(email, ADMIN_CREDENTIALS.name);
    return res.status(200).json({ success: true, message: 'Verification code sent' });
  } catch (error) {
    console.error('Failed to send verification code:', error);
    return res.status(500).json({ success: false, message: 'Failed to send verification code' });
  }
});

/**
 * Verify 2FA Code
 */
adminRouter.post('/verify-2fa', (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false, message: 'Email and verification code are required' });
  }

  if (email !== ADMIN_CREDENTIALS.email) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  // Verify the code
  const isValid = verifyCode(email, code);

  if (!isValid) {
    return res.status(401).json({ success: false, message: 'Invalid or expired verification code' });
  }

  // Update session to fully authenticated
  const sessionId = req.cookies.adminSessionId;
  if (sessionId && adminSessions.has(sessionId)) {
    const session = adminSessions.get(sessionId)!;
    session.authenticated = true;
    session.lastActivity = new Date();
    adminSessions.set(sessionId, session);
  }

  return res.status(200).json({ success: true, message: 'Authentication successful' });
});

/**
 * Check Authentication Status
 */
adminRouter.get('/check-auth', (req: Request, res: Response) => {
  const sessionId = req.cookies.adminSessionId;
  
  if (!sessionId || !adminSessions.has(sessionId)) {
    return res.status(401).json({ authenticated: false });
  }

  const session = adminSessions.get(sessionId)!;
  
  // Check if session is still valid
  if (!session.authenticated) {
    return res.status(401).json({ authenticated: false });
  }

  // Update last activity
  session.lastActivity = new Date();
  adminSessions.set(sessionId, session);

  return res.status(200).json({ 
    authenticated: true, 
    email: session.email 
  });
});

/**
 * Admin Logout
 */
adminRouter.post('/logout', (req: Request, res: Response) => {
  const sessionId = req.cookies.adminSessionId;
  
  if (sessionId) {
    // Remove session
    adminSessions.delete(sessionId);
    
    // Clear cookie
    res.clearCookie('adminSessionId');
  }
  
  return res.status(200).json({ success: true, message: 'Logged out successfully' });
});

/**
 * Helper to generate a random session ID
 */
function generateSessionId(): string {
  return Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}

// Middleware to clean up expired sessions periodically
setInterval(() => {
  const now = new Date();
  adminSessions.forEach((session, sessionId) => {
    // Remove sessions inactive for more than 30 minutes
    const inactiveTime = now.getTime() - session.lastActivity.getTime();
    if (inactiveTime > 30 * 60 * 1000) {
      adminSessions.delete(sessionId);
    }
  });
}, 5 * 60 * 1000); // Run every 5 minutes

export default adminRouter;