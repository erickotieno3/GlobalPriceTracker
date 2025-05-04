/**
 * Auto-Campaign Marketing System
 * 
 * This script automatically generates and manages digital marketing campaigns for
 * the Tesco Price Comparison platform across multiple channels, including:
 * 
 * 1. Social Media (Facebook, Twitter, Instagram)
 * 2. Email Marketing
 * 3. Google Ads
 * 4. Content Marketing
 * 5. Affiliate Marketing Promotions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { OpenAI } from 'openai';

// ES Module equivalent of __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  // Base URL for the application
  siteUrl: process.env.PRIMARY_URL || 'https://tesco-price-comparison.hyrisecrown.replit.app',
  
  // Campaign generation interval (default: 7 days)
  campaignInterval: 7 * 24 * 60 * 60 * 1000,
  
  // Marketing channels to target
  marketingChannels: ['social-media', 'email', 'google-ads', 'content', 'affiliate'],
  
  // Target audience segments
  audienceSegments: {
    'budget-shoppers': {
      interests: ['discount shopping', 'coupon hunting', 'budget meal planning'],
      keywords: ['save money', 'best deals', 'price comparison', 'coupon codes']
    },
    'tech-savvy': {
      interests: ['online shopping', 'mobile shopping', 'comparison apps'],
      keywords: ['shopping app', 'price alert', 'best price finder', 'online comparison']
    },
    'local-shoppers': {
      interests: ['local stores', 'community shopping', 'local deals'],
      keywords: ['local prices', 'nearby deals', 'community discount', 'area savings']
    }
  },
  
  // Campaign types
  campaignTypes: {
    'holiday-special': {
      frequency: 'seasonal',
      timing: ['christmas', 'easter', 'thanksgiving', 'black-friday']
    },
    'weekly-deals': {
      frequency: 'weekly',
      timing: ['monday']
    },
    'price-drop-alert': {
      frequency: 'triggered',
      timing: ['price-change']
    },
    'new-store-announcement': {
      frequency: 'triggered',
      timing: ['new-store-added']
    }
  },
  
  // Output directories
  outputDir: path.join(__dirname, '..', 'marketing', 'campaigns'),
  templateDir: path.join(__dirname, '..', 'marketing', 'templates'),
  
  // Log configuration
  logFile: path.join(__dirname, '..', 'logs', 'auto-campaign.log'),
  maxLogSize: 5 * 1024 * 1024 // 5MB
};

// Initialize OpenAI client if API key is available
let openai;
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
  log('OpenAI client initialized for AI-powered marketing campaign generation');
} catch (error) {
  log(`OpenAI client initialization failed: ${error.message}`, true);
}

/**
 * Make sure necessary directories exist
 */
function ensureDirectories() {
  const logsDir = path.dirname(config.logFile);
  if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
  }
  
  if (!fs.existsSync(config.outputDir)) {
    fs.mkdirSync(config.outputDir, { recursive: true });
  }
  
  if (!fs.existsSync(config.templateDir)) {
    fs.mkdirSync(config.templateDir, { recursive: true });
  }
}

/**
 * Log a message to both console and log file
 */
function log(message, isError = false) {
  const timestamp = new Date().toISOString();
  const logMessage = `${timestamp} - ${message}`;
  
  if (isError) {
    console.error(logMessage);
  } else {
    console.log(logMessage);
  }
  
  // Append to log file
  ensureDirectories();
  fs.appendFileSync(config.logFile, logMessage + '\n');
  
  // Check log file size and rotate if needed
  rotateLogFile();
}

/**
 * Rotate the log file when it gets too big
 */
function rotateLogFile() {
  try {
    const stats = fs.statSync(config.logFile);
    if (stats.size > config.maxLogSize) {
      const backupFile = `${config.logFile}.old`;
      if (fs.existsSync(backupFile)) {
        fs.unlinkSync(backupFile);
      }
      fs.renameSync(config.logFile, backupFile);
      log('Log file rotated due to size limit');
    }
  } catch (error) {
    // Ignore errors if file doesn't exist yet
    if (error.code !== 'ENOENT') {
      console.error('Error rotating log file:', error.message);
    }
  }
}

/**
 * Generate social media posts using AI
 */
async function generateSocialMediaContent(campaign, audience) {
  if (!openai) {
    log('OpenAI client not available, using fallback social media content', true);
    return [
      {
        platform: 'facebook',
        content: `🔥 Hot Deal Alert! Save big on your groceries with Tesco Price Comparison. Visit ${config.siteUrl} now!`,
        hashtags: ['#savemoney', '#deals', '#pricecomparison']
      },
      {
        platform: 'twitter',
        content: `Why pay more? Find the best grocery deals across multiple stores in one place! ${config.siteUrl}`,
        hashtags: ['#bargainshopping', '#grocerysavings']
      },
      {
        platform: 'instagram',
        content: `Smart shoppers use price comparison to save up to 30% on their weekly shop! Check us out at ${config.siteUrl}`,
        hashtags: ['#smartshopping', '#savingmoney', '#dealsoftheday']
      }
    ];
  }
  
  try {
    const prompt = `
Generate 4 social media posts for a price comparison website focused on ${campaign.name} campaign.
Target audience: ${audience.name} - ${audience.description}.
Include appropriate hashtags and a compelling call to action.
Make them engaging, shareable, and focused on saving money through price comparison.
Format as JSON array with objects: [{"platform": "facebook|twitter|instagram|linkedin", "content": "...", "hashtags": ["...", "..."]}]
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a digital marketing expert specializing in e-commerce and price comparison websites." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Generated ${result.length || 0} social media posts for ${campaign.name} campaign`);
    return result.posts || result;
  } catch (error) {
    log(`Error generating social media content with AI: ${error.message}`, true);
    return [
      {
        platform: 'facebook',
        content: `🔥 Hot Deal Alert! Save big on your groceries with Tesco Price Comparison. Visit ${config.siteUrl} now!`,
        hashtags: ['#savemoney', '#deals', '#pricecomparison']
      },
      {
        platform: 'twitter',
        content: `Why pay more? Find the best grocery deals across multiple stores in one place! ${config.siteUrl}`,
        hashtags: ['#bargainshopping', '#grocerysavings']
      },
      {
        platform: 'instagram',
        content: `Smart shoppers use price comparison to save up to 30% on their weekly shop! Check us out at ${config.siteUrl}`,
        hashtags: ['#smartshopping', '#savingmoney', '#dealsoftheday']
      }
    ];
  }
}

/**
 * Generate email marketing content using AI
 */
async function generateEmailContent(campaign, audience) {
  if (!openai) {
    log('OpenAI client not available, using fallback email content', true);
    return {
      subject: `Save Big on Your Weekly Shop with ${campaign.name}!`,
      body: `
<h1>Compare Prices, Save Money</h1>
<p>Hello,</p>
<p>Looking to save on your shopping? Check out our price comparison tool that helps you find the best deals across multiple stores.</p>
<p><a href="${config.siteUrl}">Start Saving Now</a></p>
      `,
      callToAction: 'Compare Prices Now'
    };
  }
  
  try {
    const prompt = `
Generate an email marketing message for a price comparison website focused on ${campaign.name} campaign.
Target audience: ${audience.name} - ${audience.description}.
Include a subject line, body content with HTML formatting, and a call to action.
Focus on saving money through price comparison and finding the best deals.
Format as JSON: {"subject": "...", "body": "...", "callToAction": "..."}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an email marketing expert specializing in e-commerce and price comparison websites." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Generated email content for ${campaign.name} campaign`);
    return result;
  } catch (error) {
    log(`Error generating email content with AI: ${error.message}`, true);
    return {
      subject: `Save Big on Your Weekly Shop with ${campaign.name}!`,
      body: `
<h1>Compare Prices, Save Money</h1>
<p>Hello,</p>
<p>Looking to save on your shopping? Check out our price comparison tool that helps you find the best deals across multiple stores.</p>
<p><a href="${config.siteUrl}">Start Saving Now</a></p>
      `,
      callToAction: 'Compare Prices Now'
    };
  }
}

/**
 * Generate Google Ads content using AI
 */
async function generateGoogleAdsContent(campaign, audience) {
  if (!openai) {
    log('OpenAI client not available, using fallback Google Ads content', true);
    return [
      {
        headline1: 'Compare Grocery Prices',
        headline2: 'Save Up to 30% on Shopping',
        headline3: 'All Stores in One Place',
        description1: 'Find the lowest prices on groceries and household items.',
        description2: 'Compare prices across multiple supermarkets instantly.',
        finalUrl: config.siteUrl
      }
    ];
  }
  
  try {
    const prompt = `
Generate 3 Google Ads for a price comparison website focused on ${campaign.name} campaign.
Target audience: ${audience.name} - ${audience.description}.
Include 3 headlines (max 30 chars each) and 2 descriptions (max 90 chars each).
Focus on saving money through price comparison and finding the best deals.
Format as JSON array with objects: [{"headline1": "...", "headline2": "...", "headline3": "...", "description1": "...", "description2": "..."}]
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a PPC advertising expert specializing in Google Ads for e-commerce and price comparison websites." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Generated ${result.ads?.length || 0} Google Ads for ${campaign.name} campaign`);
    
    // Add final URL to each ad
    const ads = (result.ads || result).map(ad => ({
      ...ad,
      finalUrl: config.siteUrl
    }));
    
    return ads;
  } catch (error) {
    log(`Error generating Google Ads content with AI: ${error.message}`, true);
    return [
      {
        headline1: 'Compare Grocery Prices',
        headline2: 'Save Up to 30% on Shopping',
        headline3: 'All Stores in One Place',
        description1: 'Find the lowest prices on groceries and household items.',
        description2: 'Compare prices across multiple supermarkets instantly.',
        finalUrl: config.siteUrl
      }
    ];
  }
}

/**
 * Generate content marketing materials using AI
 */
async function generateContentMarketing(campaign, audience) {
  if (!openai) {
    log('OpenAI client not available, using fallback content marketing', true);
    return {
      blogPost: {
        title: '10 Ways to Save Money on Your Weekly Shopping',
        summary: 'Discover practical tips to reduce your grocery spending without compromising on quality.',
        keypoints: [
          'Use price comparison tools to find the best deals',
          'Plan your meals around discounted items',
          'Buy seasonal produce for better value',
          'Take advantage of loyalty programs',
          'Stock up on staples when they\'re on sale'
        ]
      },
      infographic: {
        title: 'The Smart Shopper\'s Money-Saving Guide',
        dataPoints: [
          'Average family can save £1,500/year by comparing prices',
          '67% of shoppers overpay by not comparing prices',
          'Price differences between stores can be up to 40%',
          'Most popular items have the highest price variance'
        ]
      }
    };
  }
  
  try {
    const prompt = `
Generate content marketing materials for a price comparison website focused on ${campaign.name} campaign.
Target audience: ${audience.name} - ${audience.description}.
Include a blog post idea (title, summary, and 5 key points) and an infographic concept (title and 4 data points).
Focus on saving money through price comparison and finding the best deals.
Format as JSON: {"blogPost": {"title": "...", "summary": "...", "keypoints": ["...", "..."]}, "infographic": {"title": "...", "dataPoints": ["...", "..."]}}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are a content marketing expert specializing in e-commerce and price comparison websites." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Generated content marketing materials for ${campaign.name} campaign`);
    return result;
  } catch (error) {
    log(`Error generating content marketing with AI: ${error.message}`, true);
    return {
      blogPost: {
        title: '10 Ways to Save Money on Your Weekly Shopping',
        summary: 'Discover practical tips to reduce your grocery spending without compromising on quality.',
        keypoints: [
          'Use price comparison tools to find the best deals',
          'Plan your meals around discounted items',
          'Buy seasonal produce for better value',
          'Take advantage of loyalty programs',
          'Stock up on staples when they\'re on sale'
        ]
      },
      infographic: {
        title: 'The Smart Shopper\'s Money-Saving Guide',
        dataPoints: [
          'Average family can save £1,500/year by comparing prices',
          '67% of shoppers overpay by not comparing prices',
          'Price differences between stores can be up to 40%',
          'Most popular items have the highest price variance'
        ]
      }
    };
  }
}

/**
 * Generate affiliate marketing materials using AI
 */
async function generateAffiliateMarketing(campaign, audience) {
  if (!openai) {
    log('OpenAI client not available, using fallback affiliate marketing', true);
    return {
      banners: [
        {
          headline: 'SAVE UP TO 30% ON GROCERIES',
          subheading: 'Compare prices across all major supermarkets',
          callToAction: 'Start Saving Now'
        }
      ],
      emailTemplate: {
        subject: 'Earn Commission Promoting Price Comparison Tool',
        body: `
<h1>Join Our Affiliate Program</h1>
<p>Hello valued partner,</p>
<p>Promote our price comparison tool and earn commissions on every new user who signs up through your unique link.</p>
<p><a href="${config.siteUrl}/affiliates">Join Now</a></p>
        `
      },
      promotionalText: 'Help your audience save money on groceries while earning commission. Our price comparison tool finds the best deals across all major supermarkets, saving shoppers up to 30% on their weekly shop.'
    };
  }
  
  try {
    const prompt = `
Generate affiliate marketing materials for a price comparison website focused on ${campaign.name} campaign.
Target audience: ${audience.name} - ${audience.description}.
Include banner ad copy (headline, subheading, CTA), affiliate email template (subject, body), and promotional text.
Focus on saving money through price comparison and affiliate commission opportunities.
Format as JSON: {"banners": [{"headline": "...", "subheading": "...", "callToAction": "..."}], "emailTemplate": {"subject": "...", "body": "..."}, "promotionalText": "..."}
    `;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        { role: "system", content: "You are an affiliate marketing expert specializing in e-commerce and price comparison websites." },
        { role: "user", content: prompt }
      ],
      response_format: { type: "json_object" }
    });
    
    const result = JSON.parse(response.choices[0].message.content);
    log(`Generated affiliate marketing materials for ${campaign.name} campaign`);
    return result;
  } catch (error) {
    log(`Error generating affiliate marketing with AI: ${error.message}`, true);
    return {
      banners: [
        {
          headline: 'SAVE UP TO 30% ON GROCERIES',
          subheading: 'Compare prices across all major supermarkets',
          callToAction: 'Start Saving Now'
        }
      ],
      emailTemplate: {
        subject: 'Earn Commission Promoting Price Comparison Tool',
        body: `
<h1>Join Our Affiliate Program</h1>
<p>Hello valued partner,</p>
<p>Promote our price comparison tool and earn commissions on every new user who signs up through your unique link.</p>
<p><a href="${config.siteUrl}/affiliates">Join Now</a></p>
        `
      },
      promotionalText: 'Help your audience save money on groceries while earning commission. Our price comparison tool finds the best deals across all major supermarkets, saving shoppers up to 30% on their weekly shop.'
    };
  }
}

/**
 * Fetch top products for campaign focus
 */
async function fetchTopProducts() {
  try {
    const response = await fetch(`${config.siteUrl}/api/products/popular?limit=5`);
    if (response.ok) {
      return await response.json();
    } else {
      log(`Failed to fetch top products: ${response.status}`, true);
      return [];
    }
  } catch (error) {
    log(`Error fetching top products: ${error.message}`, true);
    return [];
  }
}

/**
 * Determine current seasonal campaigns
 */
function determineSeasonalCampaigns() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12
  
  let seasonalCampaigns = [];
  
  // Major shopping seasons
  if (month === 11) {
    seasonalCampaigns.push({
      name: 'Black Friday Savings',
      type: 'holiday-special',
      priority: 'high'
    });
  } else if (month === 12) {
    seasonalCampaigns.push({
      name: 'Christmas Shopping',
      type: 'holiday-special',
      priority: 'high'
    });
  } else if (month === 1) {
    seasonalCampaigns.push({
      name: 'January Sales',
      type: 'holiday-special',
      priority: 'high'
    });
  } else if (month === 4 || month === 3) {
    seasonalCampaigns.push({
      name: 'Easter Deals',
      type: 'holiday-special',
      priority: 'medium'
    });
  }
  
  // Always add a weekly deals campaign
  seasonalCampaigns.push({
    name: 'Weekly Price Drops',
    type: 'weekly-deals',
    priority: 'medium'
  });
  
  return seasonalCampaigns;
}

/**
 * Generate campaign for specific audience segment
 */
async function generateCampaignForAudience(campaign, audienceKey) {
  const audience = {
    name: audienceKey,
    description: config.audienceSegments[audienceKey].interests.join(', '),
    interests: config.audienceSegments[audienceKey].interests,
    keywords: config.audienceSegments[audienceKey].keywords
  };
  
  log(`Generating ${campaign.name} campaign for ${audience.name} audience...`);
  
  // Generate content for different marketing channels
  const socialMedia = await generateSocialMediaContent(campaign, audience);
  const email = await generateEmailContent(campaign, audience);
  const googleAds = await generateGoogleAdsContent(campaign, audience);
  const contentMarketing = await generateContentMarketing(campaign, audience);
  const affiliateMarketing = await generateAffiliateMarketing(campaign, audience);
  
  // Combine all content into a complete campaign
  const completeCampaign = {
    name: campaign.name,
    type: campaign.type,
    audience: audience.name,
    priority: campaign.priority,
    dateGenerated: new Date().toISOString(),
    channels: {
      socialMedia,
      email,
      googleAds,
      contentMarketing,
      affiliateMarketing
    }
  };
  
  // Save campaign to file
  const filename = `${campaign.name.toLowerCase().replace(/\s+/g, '-')}-${audience.name}-${new Date().toISOString().split('T')[0]}.json`;
  const filePath = path.join(config.outputDir, filename);
  fs.writeFileSync(filePath, JSON.stringify(completeCampaign, null, 2));
  
  log(`Campaign saved to ${filePath}`);
  return completeCampaign;
}

/**
 * Generate all campaigns for current season
 */
async function generateCampaigns() {
  log('Starting campaign generation process...');
  
  try {
    // Ensure necessary directories exist
    ensureDirectories();
    
    // Determine seasonal campaigns
    const seasonalCampaigns = determineSeasonalCampaigns();
    log(`Identified ${seasonalCampaigns.length} seasonal campaigns`);
    
    const allCampaigns = [];
    
    // Generate campaigns for each audience segment
    for (const campaign of seasonalCampaigns) {
      for (const audienceKey in config.audienceSegments) {
        const campaignForAudience = await generateCampaignForAudience(campaign, audienceKey);
        allCampaigns.push(campaignForAudience);
      }
    }
    
    // Create a campaign index file
    const indexPath = path.join(config.outputDir, 'campaign-index.json');
    const campaignIndex = {
      generatedAt: new Date().toISOString(),
      campaigns: allCampaigns.map(c => ({
        name: c.name,
        audience: c.audience,
        priority: c.priority,
        dateGenerated: c.dateGenerated
      }))
    };
    fs.writeFileSync(indexPath, JSON.stringify(campaignIndex, null, 2));
    
    log(`Generated ${allCampaigns.length} campaigns successfully`);
    return allCampaigns;
  } catch (error) {
    log(`Campaign generation process failed: ${error.message}`, true);
    return [];
  }
}

/**
 * Check if campaigns need to be updated
 */
function needsCampaignsUpdate() {
  try {
    const indexPath = path.join(config.outputDir, 'campaign-index.json');
    const indexExists = fs.existsSync(indexPath);
    if (!indexExists) {
      return true;
    }
    
    const indexData = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    const lastGenerated = new Date(indexData.generatedAt).getTime();
    const now = new Date().getTime();
    
    return (now - lastGenerated) > config.campaignInterval;
  } catch (error) {
    // If there's any error checking, assume we need an update
    return true;
  }
}

/**
 * Main function to start the Auto-Campaign system
 */
async function startAutoCampaign() {
  log('Auto-Campaign system started');
  
  // Perform initial campaign generation if needed
  if (needsCampaignsUpdate()) {
    log('Initial campaign update needed');
    await generateCampaigns();
  } else {
    log('Campaigns are up to date, no immediate update needed');
  }
  
  // Schedule regular campaign updates
  setInterval(async () => {
    log('Scheduled campaign update time reached');
    await generateCampaigns();
  }, config.campaignInterval);
}

// Run the Auto-Campaign system if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  startAutoCampaign().catch(error => {
    log(`Unhandled error in Auto-Campaign system: ${error.message}`, true);
  });
}

// Export for use in other modules
export { startAutoCampaign, generateCampaigns, generateSocialMediaContent, generateEmailContent };