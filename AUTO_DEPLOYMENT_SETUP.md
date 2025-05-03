# Auto-Deployment Setup Guide

This guide explains how to set up automatic deployment for your Tesco Price Comparison application using GitHub Actions. This will allow you to automatically deploy your application whenever changes are pushed to your main branch.

## Prerequisites

1. A GitHub account
2. Your Replit project connected to GitHub
3. A Replit API token

## Step 1: Connect Your Replit Project to GitHub

1. In your Replit project, click on the "Version Control" tab in the left sidebar
2. Click "Connect to GitHub"
3. Follow the prompts to authorize Replit to access your GitHub account
4. Create a new repository or select an existing one

## Step 2: Generate a Replit API Token

1. Go to your Replit account settings: https://replit.com/account
2. Navigate to the "API Tokens" section
3. Click "Generate new token"
4. Give your token a descriptive name like "GitHub Auto-Deploy"
5. Copy the generated token (you will only see it once)

## Step 3: Add Your Replit Token to GitHub Secrets

1. Go to your GitHub repository
2. Click on "Settings" > "Secrets and variables" > "Actions"
3. Click "New repository secret"
4. Name: `REPLIT_TOKEN`
5. Value: Paste your Replit API token from Step 2
6. Click "Add secret"

## Step 4: Push Your Repository to GitHub

1. From your Replit project, go to the "Version Control" tab
2. Add a commit message
3. Click "Commit & push"

## Step 5: Verify GitHub Actions Workflow

1. Go to your GitHub repository
2. Click on the "Actions" tab
3. You should see the "Auto Deploy to Replit" workflow running
4. Once it completes, go to your Replit project's "Deployments" tab
5. You should see a new deployment that was created by the GitHub Action

## Step 6: Configure Domain (After Deployment)

After deployment is successful, you need to set up your domain:

1. In Porkbun (domain registrar):
   - Set an A record for @ (root domain) pointing to Replit's IP: 5.161.202.234
   - Set a CNAME record for www pointing to your Replit deployment URL

## Notes

- You'll still need to manually click the "Promote" button in Replit to make a deployment live
- This is a safety feature to ensure that you don't automatically promote a broken build
- If you want fully automated promotion, you would need to use the Replit API directly (which is more complex and requires additional authentication)

## Troubleshooting

If you encounter any issues with your GitHub Actions workflow:

1. Check the workflow logs in the GitHub Actions tab
2. Verify your REPLIT_TOKEN is correct and hasn't expired
3. Make sure your Replit project is properly connected to GitHub
4. Check if there are any build errors in your application