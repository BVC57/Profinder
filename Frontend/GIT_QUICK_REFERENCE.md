# Git Quick Reference Card

## Daily Workflow

### Start of Day
```bash
git checkout main
git pull origin main
git checkout -b feature/your-feature-name
```

### During Development
```bash
git status                    # Check what's changed
git add .                     # Stage all changes
git commit -m "descriptive message"
git push origin feature/your-feature-name
```

### End of Day
```bash
git push origin feature/your-feature-name  # Push your work
# Create Pull Request on GitHub
```

## Essential Commands

### Branch Management
```bash
git branch                    # List local branches
git branch -a                 # List all branches
git checkout branch-name      # Switch to branch
git checkout -b new-branch    # Create and switch to new branch
git branch -d branch-name     # Delete local branch
```

### File Operations
```bash
git add filename              # Stage specific file
git add .                     # Stage all changes
git reset filename            # Unstage file
git checkout -- filename      # Discard changes in file
```

### Commits
```bash
git commit -m "message"       # Commit staged changes
git commit -am "message"      # Stage and commit all tracked files
git reset --soft HEAD~1       # Undo last commit (keep changes)
git reset --hard HEAD~1       # Undo last commit (discard changes)
```

### Remote Operations
```bash
git push origin branch-name   # Push to remote
git pull origin branch-name   # Pull from remote
git fetch origin              # Download remote changes
git merge origin/branch-name  # Merge remote changes
```

## Common Scenarios

### Update Your Branch with Main
```bash
git checkout main
git pull origin main
git checkout your-branch
git rebase main
```

### Stash Work Temporarily
```bash
git stash                     # Save current work
git stash pop                 # Restore saved work
git stash list                # List stashes
```

### Fix Merge Conflicts
```bash
git status                    # See conflicted files
# Edit files to resolve conflicts
git add .                     # Stage resolved files
git commit -m "resolve conflicts"
```

### View History
```bash
git log --oneline             # Compact history
git log --oneline --graph     # Visual history
git show commit-hash          # Show specific commit
```

## Commit Message Format

Use conventional commit format:
```
type(scope): description

feat: add new feature
fix: resolve bug
docs: update documentation
style: formatting changes
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## Branch Naming Convention

- `feature/feature-name` - New features
- `bugfix/bug-description` - Bug fixes
- `hotfix/urgent-fix` - Critical fixes
- `user/username/feature` - User-specific work

## Quick Troubleshooting

### Undo Last Commit
```bash
git reset --soft HEAD~1       # Keep changes staged
git reset --mixed HEAD~1      # Keep changes unstaged
git reset --hard HEAD~1       # Discard changes
```

### Change Last Commit Message
```bash
git commit --amend -m "new message"
```

### See What Changed
```bash
git diff                      # Unstaged changes
git diff --staged             # Staged changes
git diff HEAD~1               # Changes in last commit
```

### Clean Up
```bash
git clean -n                  # See what would be deleted
git clean -f                  # Delete untracked files
git clean -fd                 # Delete untracked files and directories
```

## Team Collaboration Tips

1. **Always pull before starting work**
2. **Use descriptive commit messages**
3. **Create small, focused commits**
4. **Test before pushing**
5. **Communicate with team about conflicts**
6. **Use pull requests for code review** 