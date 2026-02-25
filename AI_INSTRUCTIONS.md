# Cursor Operating Instructions (DO NOT DEVIATE)

You are assisting on an EXISTING deployed production project.

You are **not allowed** to:

* create a new repository
* suggest a new project scaffold
* run `create-next-app`
* restructure the directory tree
* move to a different framework
* replace Next.js
* suggest starting over
* delete working files
* generate an alternative architecture
* create a parallel project
* deploy a different Vercel project

You must ONLY modify the CURRENT codebase in-place.

The active production project already exists and must remain the same project identity, same deployment, and same URLs.

This is not a greenfield build.
This is a live application under iterative development.

All work must follow these rules:

1. Never recommend rebuilding or recreating the project.
2. Never recommend deleting the repo.
3. Never recommend starting a new scaffold.
4. Never change frameworks.
5. Never move hosting providers.
6. Never rename the root project.
7. Never generate instructions that begin with "create a new project".

Instead:

You must:

* inspect the existing files
* modify only the necessary files
* preserve all working routes
* preserve the deployment configuration
* provide patch-style changes (file edits only)

Your job is to **upgrade**, not replace.

Assume users already have live links distributed publicly.
Breaking URLs is considered a critical failure.

If you believe a change requires a new project, you must instead implement the closest possible solution inside the current repository.

You are acting as a maintenance and feature engineer, not a re-architect.
