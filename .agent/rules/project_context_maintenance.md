# Project Context Maintenance Rules

## Purpose
These rules ensure that `project_context.md` remains accurate and up-to-date as the project evolves.

---

## MANDATORY: When to Update project_context.md

**Every developer (human or AI) MUST update `project_context.md` when making changes in these categories:**

### 1. **Architecture & Structure Changes**
- [ ] Adding new major components or removing existing ones
- [ ] Changing application routing or navigation structure
- [ ] Modifying state management patterns
- [ ] Adding new services or business logic layers
- [ ] Changing project folder structure

### 2. **Database Schema Changes**
- [ ] Adding/removing tables
- [ ] Adding/removing columns
- [ ] Modifying constraints (unique, foreign keys, etc.)
- [ ] Changing RLS (Row Level Security) policies
- [ ] Updating relationships between tables

### 3. **Tech Stack Updates**
- [ ] Adding new dependencies (especially major libraries)
- [ ] Upgrading major versions of existing dependencies
- [ ] Changing build tools or bundlers
- [ ] Adding new external services or APIs
- [ ] Modifying environment variable requirements

### 4. **Core Business Logic**
- [ ] Modifying streak calculation algorithms
- [ ] Changing scoring or point systems
- [ ] Updating validation rules
- [ ] Modifying authentication flows
- [ ] Changing data transformation logic

### 5. **Critical Bugs & Solutions**
- [ ] Discovering edge cases or gotchas
- [ ] Implementing bug fixes that reveal design patterns
- [ ] Documenting workarounds for known issues
- [ ] Recording debugging strategies that worked

### 6. **Feature Additions/Removals**
- [ ] Adding major new features
- [ ] Removing deprecated features
- [ ] Changing feature behavior significantly
- [ ] Modifying user flows

---

## Update Process

### Step 1: Identify Impacted Sections
Before making code changes, identify which sections of `project_context.md` will need updates:
- Technology Stack
- Project Structure  
- Core Features
- Critical Business Logic
- Database Configuration
- Known Issues & Gotchas

### Step 2: Update During Development
**Update `project_context.md` AS PART OF your pull request/commit**, not after.

### Step 3: Verify Accuracy
After updating, verify:
- [ ] All code examples are accurate
- [ ] All file paths are correct
- [ ] Database schema matches current state
- [ ] Dependencies list matches `package.json`
- [ ] Known issues section is current

### Step 4: Update Version Info
Update the "Last Updated" date at the bottom of the file.

---

## AI Agent Guidelines

**When an AI agent (like Antigravity) makes changes to this codebase:**

1. **Read `project_context.md` FIRST** before making any architectural changes
2. **Check if your changes require updates** to `project_context.md`
3. **Update the file immediately** if any of the mandatory triggers apply
4. **Preserve formatting and structure** of the document
5. **Add, don't replace**: Expand sections rather than rewriting them entirely

### AI-Specific Triggers
An AI agent MUST update `project_context.md` when:
- Installing new npm packages
- Modifying database schema via SQL
- Creating new service files
- Adding new React components (update component count)
- Changing environment variables
- Discovering bugs during debugging sessions
- Implementing new algorithms or business logic

---

## Examples

### ✅ Good Practice
```
# Pull Request: Add Payment Integration

Changes:
1. Added `PaymentService.ts` in services/
2. Added Stripe dependency to package.json
3. Updated project_context.md:
   - Tech Stack section (added Stripe)
   - Project Structure (added PaymentService)
   - Core Features (added Payment Processing section)
```

### ❌ Bad Practice
```
# Pull Request: Add Payment Integration

Changes:
1. Added `PaymentService.ts` in services/
2. Added Stripe dependency to package.json

[project_context.md not updated - future developers will have incomplete documentation]
```

---

## Enforcement

### For Human Developers
- Add `project_context.md` update to PR checklist
- Code reviewers should verify documentation updates
- CI/CD could check for file modification date

### For AI Agents
- AI agents should self-enforce these rules
- System prompts should reference this file
- Agents should proactively ask "Do my changes require updating project_context.md?"

---

## Quick Reference Checklist

Before finalizing ANY code change, ask yourself:

- [ ] Did I add/remove files?
- [ ] Did I change the database?
- [ ] Did I add/modify dependencies?
- [ ] Did I change business logic?
- [ ] Did I discover a bug or edge case?
- [ ] Will future developers need to know about this change?

**If YES to any of the above → UPDATE `project_context.md`**

---

*These rules ensure `project_context.md` remains the single source of truth for project understanding.*
