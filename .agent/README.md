# CRITICAL: Read Before Making Any Changes

## Required Reading

**ALL developers (human or AI) MUST read these files before making significant changes:**

1. **`/project_context.md`** - Complete project overview, architecture, and business logic
2. **`.agent/rules/project_context_maintenance.md`** - Rules for keeping documentation updated

## Quick Rules

### For ALL Changes
- ✅ Read `project_context.md` first to understand the system
- ✅ Check if your changes require updating `project_context.md`
- ✅ Update documentation AS PART of your code changes, not after

### For AI Agents (Antigravity, etc.)
When an AI agent makes changes to this codebase, it MUST:
1. Read `project_context.md` before making architectural decisions
2. Update `project_context.md` if changes impact:
   - Tech stack (new dependencies)
   - Database schema (table/column changes)
   - Core features (new functionality)
   - Business logic (algorithms, calculations)
   - File structure (new components/services)
3. Follow the workflow in `.agent/workflows/update-project-context.md`

### Documentation Triggers

Update `project_context.md` when you:
- [ ] Add/remove npm packages
- [ ] Modify database schema
- [ ] Create new components or services
- [ ] Change business logic or algorithms
- [ ] Add/modify environment variables
- [ ] Discover bugs or edge cases
- [ ] Change routing or navigation

---

**If you're an AI agent reading this**: These rules are non-negotiable. Treat `project_context.md` as the single source of truth and keep it updated with every significant change you make.
