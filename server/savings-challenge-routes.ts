/**
 * Savings Challenge Routes
 * 
 * This file contains API routes for handling the interactive savings challenges,
 * including creating challenges, tracking progress, and managing digital rewards.
 */

import { Router, Request, Response } from 'express';
import { db } from './db';
import { eq } from 'drizzle-orm';
import { savingsChallenges, rewards, userChallenges, userRewards } from '@shared/schema';

export const savingsChallengeRouter = Router();

/**
 * Get all available challenges
 */
savingsChallengeRouter.get('/challenges', async (req: Request, res: Response) => {
  try {
    // Check if user is authenticated
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user?.id;
    
    // Fetch all challenges and join with user progress if available
    const challenges = await db.query.savingsChallenges.findMany({
      with: {
        rewards: true,
        userChallenges: {
          where: eq(userChallenges.userId, userId)
        }
      }
    });
    
    // Format the challenges with user progress
    const formattedChallenges = challenges.map(challenge => {
      const userChallenge = challenge.userChallenges[0] || null;
      
      return {
        ...challenge,
        currentAmount: userChallenge?.currentAmount || 0,
        status: userChallenge?.status || 'active',
        userChallenges: undefined, // Remove the raw user challenges data
      };
    });
    
    res.json({ challenges: formattedChallenges });
  } catch (error) {
    console.error('Error fetching challenges:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get a specific challenge by ID
 */
savingsChallengeRouter.get('/challenges/:id', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const challengeId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    // Fetch the challenge with rewards
    const challenge = await db.query.savingsChallenges.findFirst({
      where: eq(savingsChallenges.id, challengeId),
      with: {
        rewards: true,
        userChallenges: {
          where: eq(userChallenges.userId, userId)
        }
      }
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Format the challenge with user progress
    const userChallenge = challenge.userChallenges[0] || null;
    const formattedChallenge = {
      ...challenge,
      currentAmount: userChallenge?.currentAmount || 0,
      status: userChallenge?.status || 'active',
      userChallenges: undefined,
    };
    
    res.json({ challenge: formattedChallenge });
  } catch (error) {
    console.error('Error fetching challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Start a new challenge for the user
 */
savingsChallengeRouter.post('/challenges/:id/start', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const challengeId = parseInt(req.params.id);
    const userId = req.user?.id;
    
    // Check if challenge exists
    const challenge = await db.query.savingsChallenges.findFirst({
      where: eq(savingsChallenges.id, challengeId)
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Check if user already started this challenge
    const existingUserChallenge = await db.query.userChallenges.findFirst({
      where: (userChallenge) => {
        return eq(userChallenge.userId, userId) && 
               eq(userChallenge.challengeId, challengeId);
      }
    });
    
    if (existingUserChallenge) {
      return res.status(400).json({ message: 'Challenge already started' });
    }
    
    // Create new user challenge entry
    const [newUserChallenge] = await db.insert(userChallenges).values({
      userId,
      challengeId,
      currentAmount: 0,
      status: 'active',
      startedAt: new Date(),
    }).returning();
    
    res.status(201).json({ 
      message: 'Challenge started successfully',
      userChallenge: newUserChallenge
    });
  } catch (error) {
    console.error('Error starting challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Update challenge progress
 */
savingsChallengeRouter.post('/challenges/:id/progress', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const challengeId = parseInt(req.params.id);
    const userId = req.user?.id;
    const amount = parseFloat(req.body.amount);
    
    // Validate amount
    if (!amount || isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: 'Invalid amount' });
    }
    
    // Get the challenge
    const challenge = await db.query.savingsChallenges.findFirst({
      where: eq(savingsChallenges.id, challengeId),
      with: {
        rewards: true
      }
    });
    
    if (!challenge) {
      return res.status(404).json({ message: 'Challenge not found' });
    }
    
    // Get or create user challenge
    let userChallenge = await db.query.userChallenges.findFirst({
      where: (userChallenge) => {
        return eq(userChallenge.userId, userId) && 
               eq(userChallenge.challengeId, challengeId);
      }
    });
    
    if (!userChallenge) {
      // Auto-start the challenge if not started
      const [newUserChallenge] = await db.insert(userChallenges).values({
        userId,
        challengeId,
        currentAmount: 0,
        status: 'active',
        startedAt: new Date(),
      }).returning();
      
      userChallenge = newUserChallenge;
    }
    
    // Check if challenge is already completed or failed
    if (userChallenge.status !== 'active') {
      return res.status(400).json({ 
        message: `Challenge is already ${userChallenge.status}` 
      });
    }
    
    // Update progress
    const newAmount = userChallenge.currentAmount + amount;
    const isCompleted = newAmount >= challenge.targetAmount;
    
    const [updatedUserChallenge] = await db.update(userChallenges)
      .set({
        currentAmount: newAmount,
        status: isCompleted ? 'completed' : 'active',
        completedAt: isCompleted ? new Date() : null
      })
      .where(eq(userChallenges.id, userChallenge.id))
      .returning();
    
    // If challenge completed, grant rewards
    const unlockedRewards = [];
    if (isCompleted) {
      for (const reward of challenge.rewards) {
        // Check if user already has this reward
        const existingReward = await db.query.userRewards.findFirst({
          where: (userReward) => {
            return eq(userReward.userId, userId) && 
                  eq(userReward.rewardId, reward.id);
          }
        });
        
        if (!existingReward) {
          // Grant the reward
          const [newUserReward] = await db.insert(userRewards).values({
            userId,
            rewardId: reward.id,
            earnedAt: new Date()
          }).returning();
          
          unlockedRewards.push({
            ...reward,
            earnedAt: newUserReward.earnedAt
          });
        }
      }
    }
    
    res.json({ 
      message: isCompleted ? 'Challenge completed!' : 'Progress updated',
      userChallenge: updatedUserChallenge,
      unlockedRewards,
    });
  } catch (error) {
    console.error('Error updating challenge progress:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Get user's rewards and badges
 */
savingsChallengeRouter.get('/rewards', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user?.id;
    
    // Fetch user's rewards
    const userRewardsData = await db.query.userRewards.findMany({
      where: eq(userRewards.userId, userId),
      with: {
        reward: true
      }
    });
    
    // Format rewards data
    const formattedRewards = userRewardsData.map(userReward => ({
      ...userReward.reward,
      earnedAt: userReward.earnedAt,
      unlocked: true
    }));
    
    res.json({ rewards: formattedRewards });
  } catch (error) {
    console.error('Error fetching rewards:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * Create a custom challenge
 */
savingsChallengeRouter.post('/challenges/custom', async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const userId = req.user?.id;
    const { title, description, targetAmount, deadline, category } = req.body;
    
    // Validate required fields
    if (!title || !targetAmount || !deadline) {
      return res.status(400).json({ message: 'Missing required fields' });
    }
    
    // Create the challenge
    const [newChallenge] = await db.insert(savingsChallenges).values({
      title,
      description,
      targetAmount,
      deadline: new Date(deadline),
      category: category || 'custom',
      difficultyLevel: calculateDifficulty(targetAmount),
      createdBy: userId,
      isCustom: true
    }).returning();
    
    // Automatically start the challenge for the user
    await db.insert(userChallenges).values({
      userId,
      challengeId: newChallenge.id,
      currentAmount: 0,
      status: 'active',
      startedAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Custom challenge created successfully',
      challenge: newChallenge
    });
  } catch (error) {
    console.error('Error creating challenge:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Helper function to calculate difficulty level based on target amount
function calculateDifficulty(targetAmount: number): string {
  if (targetAmount < 50) return 'easy';
  if (targetAmount < 150) return 'medium';
  return 'hard';
}