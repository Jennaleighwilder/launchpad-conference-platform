# CURSOR SYSTEM INSTRUCTION

You are not building a website.
You are extending a persistent SaaS platform called **Launchpad**.

This project is an Event Operating System (Event OS).
Every change must move the system toward fully automated event creation, management, promotion, and monetization.

You must follow these architectural rules:

## 1 — Data First

All important actions must persist to Supabase.

No feature may rely solely on frontend state.

Events, tickets, speakers, attendees, and orders are database entities, not UI concepts.

Frontend components only visualize or submit data.

The database is the source of truth.

---

## 2 — Server Owns Business Logic

The frontend must never handle business rules.

Do NOT:

* calculate payments in React
* verify ticket ownership in React
* trust client input

All sensitive actions must run through server routes or edge functions.

Use API routes or server actions for:
ticket creation
ticket purchase verification
speaker acceptance
email triggers
webhook processing

---

## 3 — Stripe is Mandatory for Payments

Payments must use Stripe Checkout.

Never build a custom payment form.

Required behavior:

User clicks Buy Ticket
→ Server creates Stripe Checkout session
→ Stripe handles payment
→ Stripe webhook notifies server
→ Server writes order and attendee records to Supabase

The webhook, not the frontend, confirms purchases.

---

## 4 — Email Automation is a Core System

Email is not optional. It is part of the product.

The system must automatically send:

speaker invitations
speaker confirmations
ticket confirmations
event reminders
schedule notifications

Emails must trigger from server events, not button clicks.

Use an email provider (Resend or SendGrid) and centralize logic in `/lib/email`.

---

## 5 — Every Event Has Actors

The platform supports 4 user roles:

Organizer
Speaker
Attendee
Admin

Permissions must be enforced server-side.

A speaker may edit only their own profile.
An attendee may view only their tickets.
An organizer controls only their events.

---

## 6 — Tickets Are Inventory

Tickets are limited resources.

The database must track:

ticket quantity
tickets sold
availability windows

The system must prevent overselling using transactional logic or atomic updates.

---

## 7 — Webhooks Drive Reality

Stripe webhooks are authoritative.

Only the webhook should:

mark orders as paid
create attendees
issue confirmation emails

The frontend may display pending state but cannot finalize a purchase.

---

## 8 — AI Features Are Assistants, Not Chatbots

AI must be used for structured automation:

generate event descriptions
create schedules
write announcements
produce social content

AI should operate on stored event data and return structured outputs, not freeform chat.

AI outputs must be saved in the database.

---

## 9 — Media Generation is Automatic

The system must be able to generate promotional assets using event data:

speaker cards
session graphics
announcement posts

Media should be produced by backend jobs, not manually by users.

---

## 10 — Never Break Production Data

You must:

never drop production tables
never rename columns without migration
always write migrations for schema changes

Supabase production data must remain intact across deployments.

---

## Coding Behavior Requirements

When implementing a feature:

1. Define database schema first
2. Create server API route
3. Implement webhook or automation
4. Only then create UI

Never start with UI-first development.

If unsure, extend the backend before touching the frontend.
