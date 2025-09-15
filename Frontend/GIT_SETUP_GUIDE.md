# Git Collaboration Setup Guide

## Quick Setup Steps

### 1. Create GitHub Repository
1. Go to GitHub.com → New repository
2. Name: "profinder"
3. Make it private
4. Don't initialize with README

### 2. Connect Your Local Repository
```bash
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/profinder.git

# Verify remote
git remote -v

# Initial commit and push
git add .
git commit -m "Initial commit: Profinder project"
git push -u origin main
```

## Branching Strategy

### Main Branches
- `main` - Production code
- `develop` - Integration branch

### Feature Branches
- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `user/username/feature` - User-specific work

## Workflow for Multiple Users

### For Each Developer

#### Setup
```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/profinder.git
cd profinder

# Configure user
git config user.name "Your Name"
git config user.email "your.email@example.com"
```

#### Daily Workflow
```bash
# Update main branch
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "feat: add new feature"

# Push to remote
git push -u origin feature/your-feature-name
```

#### Create Pull Request
1. Go to GitHub repository
2. Click "Compare & pull request"
3. Set base: `develop`, compare: your branch
4. Add description and request review

### For Project Lead
```bash
# Review and merge to develop
git checkout develop
git pull origin develop
git merge feature/feature-name
git push origin develop

# Deploy to production
git checkout main
git merge develop
git push origin main
```

## Essential Git Commands

```bash
# Check status
git status

# Switch branches
git checkout branch-name

# Create new branch
git checkout -b new-branch

# Add and commit
git add .
git commit -m "descriptive message"

# Push changes
git push origin branch-name

# Pull updates
git pull origin branch-name

# View branches
git branch -a

# Delete branch
git branch -d branch-name
```

## Best Practices

1. **Commit Messages**: Use conventional format
   - `feat: add new feature`
   - `fix: resolve bug`
   - `docs: update documentation`

2. **Regular Updates**: Keep your branch updated with main
   ```bash
   git checkout main
   git pull origin main
   git checkout your-branch
   git rebase main
   ```

3. **Code Review**: Always create pull requests for review

4. **Environment**: Never commit `.env` files

## Troubleshooting

### Merge Conflicts
```bash
git status  # See conflicted files
# Edit files to resolve conflicts
git add .
git commit -m "resolve conflicts"
```

### Undo Last Commit
```bash
git reset --soft HEAD~1  # Keep changes
git reset --hard HEAD~1  # Discard changes
```

### Stash Changes
```bash
git stash  # Save changes
git stash pop  # Restore changes
```

## Team Setup Checklist

- [ ] Create GitHub repository
- [ ] Set up branch protection rules
- [ ] Add team members with appropriate permissions
- [ ] Create `.env.example` file
- [ ] Set up development guidelines
- [ ] Configure code review process 