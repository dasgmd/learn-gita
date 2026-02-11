---
description: Update project context documentation
---

# Update Project Context Workflow

This workflow ensures `project_context.md` stays accurate and comprehensive.

## When to Use This Workflow

Run this workflow whenever you make significant changes to the codebase, especially:
- After adding new features
- After modifying database schema
- After changing tech stack dependencies
- After discovering important bugs or patterns

## Steps

### 1. Review Your Changes
Identify what you've changed:
- New files added?
- Database schema modified?
- Dependencies updated?
- Business logic changed?
- Bugs discovered?

### 2. Open project_context.md
```bash
# Open the file in your editor
open /Users/dasgargamuni/Downloads/learngita.com/project_context.md
```

### 3. Update Relevant Sections

**Tech Stack Section**: If you added/upgraded dependencies
- Update version numbers in the Frontend/Backend sections
- Add any new libraries or services

**Project Structure Section**: If you added/removed files
- Update the file tree
- Update component/service counts

**Core Features Section**: If you added/modified features
- Add new feature descriptions
- Update existing feature documentation

**Critical Business Logic Section**: If you changed algorithms
- Document the new logic
- Update code examples
- Note any edge cases

**Database Configuration Section**: If you changed schema
- Update table structures
- Document new columns/constraints
- Update SQL examples

**Known Issues & Gotchas Section**: If you discovered bugs
- Add new gotchas
- Document solutions
- Remove fixed issues

### 4. Update Version Information
At the bottom of `project_context.md`:
```markdown
**Last Updated**: [TODAY'S DATE in YYYY-MM-DD format]
```

### 5. Verify Accuracy

Check that:
- [ ] All file paths are correct
- [ ] All code snippets are accurate
- [ ] All version numbers match `package.json`
- [ ] Database schema matches current SQL
- [ ] No outdated information remains

### 6. Commit the Update
```bash
git add project_context.md
git commit -m "docs: update project context for [brief description of changes]"
```

## AI Agent Instructions

If you are an AI agent running this workflow:

1. **Read the current `project_context.md` first**
2. **Identify which sections need updates** based on recent changes
3. **Use targeted edits** - don't rewrite entire sections unnecessarily
4. **Preserve formatting** - maintain the existing markdown structure
5. **Update the "Last Updated" date** at the bottom
6. **Self-verify** - check that your changes are accurate

## Quick Update Template

For quick updates, use this format in your PR/commit:

```markdown
## project_context.md Updates

### Sections Modified
- [x] Tech Stack (added X dependency)
- [x] Core Features (added Y feature)
- [ ] Database Schema (no changes)
- [x] Known Issues (documented Z bug)

### Changes Summary
- Added Stripe integration to Tech Stack
- Documented new Payment feature
- Added timezone gotcha to Known Issues
```

---

*Keep documentation synchronized with code to maintain project clarity.*
