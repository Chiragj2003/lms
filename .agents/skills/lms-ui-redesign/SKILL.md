---
name: lms-ui-redesign
description: Redesigns and polishes an existing Next.js LMS frontend using reference screenshots while preserving all existing functionality, routes, API contracts, authentication, Prisma data access, role permissions, and business logic. Use when improving the visual design, UX flow, responsive layout, accessibility, interaction states, or frontend consistency of an existing LMS without changing backend behavior.
---

# LMS UI Redesign Skill

## Mission

Transform the existing LMS into a polished, production-quality education marketplace and learning platform.

The existing application is functionally complete. Treat functionality as protected infrastructure. The primary job is to improve:

- visual hierarchy
- information architecture
- page-to-page UX flow
- typography
- spacing
- responsive behavior
- navigation
- cards
- forms
- dashboards
- empty/loading/error states
- micro-interactions
- accessibility
- visual consistency

Use the provided design references as inspiration, not as pixel-copy targets.

Reference direction:
1. A modern education marketplace: warm off-white background, strong editorial typography, teal/green accent, rounded course cards, large hero section, category exploration, testimonials, FAQ and strong CTA.
2. A modern education SaaS: restrained white layout, purple accent system, rounded containers, clean statistics, service/category cards, educator profiles, testimonial section and strong CTA bands.

Do NOT copy brand names, logos, text, illustrations, or exact layouts from the references.

---

# Non-negotiable safety rules

## Preserve functionality

Before editing, inspect the repository and identify:

- all routes
- server components
- client components
- API routes
- server actions
- Prisma queries
- authentication/session checks
- role checks
- Stripe checkout
- webhook handling
- EdgeStore uploads
- course/chapter/quiz CRUD
- progress tracking
- notes
- Q&A
- ratings/reviews
- certificates
- tutor analytics
- Ollama integration
- Zustand state
- Excalidraw integration

The redesign must NOT:

- change API route names
- change HTTP methods
- change request/response contracts
- change Prisma schema
- change database relations
- change authentication behavior
- change Better Auth configuration
- weaken tutor ownership checks
- weaken learner purchase checks
- change Stripe/webhook behavior
- remove existing features
- replace working functionality with mock data
- introduce fake API responses
- change business rules merely to make the UI easier

If a visual change appears to require a functional change, stop and report it before implementing.

## Frontend-first rule

Prefer changes to:

- JSX/TSX structure
- CSS
- Tailwind classes
- design tokens
- reusable UI components
- layout components
- navigation components
- loading/error/empty states
- animations
- accessibility attributes

Do not modify backend logic unless absolutely necessary for a UI bug, and if necessary, isolate the change and explain it.

---

# Design system

Create or consolidate a reusable visual system instead of styling every page independently.

## Visual personality

Target:

"Premium modern learning platform — clean, confident, approachable, editorial, slightly playful."

Avoid:

- generic Bootstrap-looking UI
- excessive gradients
- excessive glassmorphism
- random rounded rectangles
- huge text everywhere
- dense dashboard tables
- inconsistent card radii
- too many accent colors
- decorative animation that harms usability

## Color system

Use a restrained palette:

- primary: deep teal/emerald
- secondary accent: warm orange/coral
- surface: white
- page background: very light warm gray/cream
- text: near-black/slate
- muted text: slate gray
- success: green
- warning: amber
- error: red

For tutor/admin areas, the same design language may use a subtle purple accent where useful, but do not create a completely separate product.

Define tokens centrally.

## Typography

Use a modern sans-serif with strong hierarchy.

Recommended hierarchy:

- Display: bold, compact, high-impact
- H1: 40–56px desktop
- H2: 30–40px
- H3: 20–24px
- body: 15–17px
- metadata: 12–14px

Use responsive typography rather than fixed desktop sizes.

## Shape

Use a consistent radius scale:

- small controls: 8–10px
- cards: 14–18px
- hero/large panels: 20–28px

Use subtle borders and shadows. Prefer depth through spacing and hierarchy over heavy shadows.

## Layout

Use a consistent content width around 1200–1280px.

Desktop:
- generous horizontal whitespace
- 12-column/grid-based layouts
- strong section rhythm

Tablet:
- reduce columns
- preserve hierarchy

Mobile:
- single-column flow
- horizontally scrollable category/filter areas where appropriate
- sticky actions when useful
- no horizontal overflow

---

# Information architecture

The product has three major experiences.

## Public marketplace

Flow:

Home
→ Browse/Search
→ Category
→ Course detail
→ Preview
→ Checkout
→ Purchase
→ Learning

Public pages should feel like one coherent marketplace.

Navigation should expose:

- Courses
- Categories
- Become a Tutor
- Search
- Sign in
- Get Started

If the existing application has different working routes, keep those routes and adapt the UI around them.

## Learner experience

Flow:

Dashboard
→ My Learning
→ Course
→ Chapter
→ Video
→ Notes/Q&A/Canvas/AI
→ Quiz
→ Completion
→ Certificate
→ Review

The learner should always know:

- where they are
- what is completed
- what is next
- what is locked
- how much progress remains

## Tutor experience

Flow:

Tutor Dashboard
→ Courses
→ Create/Edit Course
→ Chapters
→ Chapter editor
→ Resources
→ Quiz
→ Publish
→ Analytics

The tutor UI should prioritize creation efficiency.

Use:

- clear step/status indicators
- persistent course navigation
- completion checklist
- save/publish states
- preview controls
- inline validation
- clear destructive-action confirmation

---

# Page-specific redesign requirements

## Home page

Create a premium marketplace landing page:

1. Header
2. Hero with clear value proposition
3. Search CTA
4. trust/statistics strip
5. popular/new courses
6. categories
7. learning benefits
8. featured tutors or educators
9. testimonials
10. FAQ
11. strong final CTA
12. footer

Do not add fake statistics or testimonials. Reuse real existing data where available; otherwise use neutral UI placeholders or omit the section.

## Course listing/search

Improve:

- search hierarchy
- category filters
- sorting
- responsive filter controls
- course card information hierarchy

Course cards should clearly communicate:

- thumbnail
- title
- tutor
- rating
- students/purchases where real data exists
- price
- discount/coupon state if applicable
- level/category if available

Avoid overcrowding cards.

## Course detail

Prioritize conversion clarity without changing checkout logic.

Structure:

- breadcrumb
- title
- short description
- tutor
- rating
- category
- hero/course image
- price/enrollment card
- coupon area
- learning outcomes
- curriculum
- preview/free chapters
- tutor information
- reviews
- FAQ
- related courses

On mobile, make the enrollment CTA easy to reach.

## Learning page

This is the most important functional UI.

Create a professional course-player experience:

Desktop:
- left: chapter/course navigation
- center: video/content
- right or secondary panel: notes/Q&A/AI depending on current implementation

Mobile:
- video first
- compact course progress
- chapter selector
- tabs for Notes/Q&A/Canvas/AI

Show:

- course title
- chapter title
- progress
- completed state
- locked state
- next chapter
- quiz state

Never interfere with the existing video/progress APIs.

## Tutor dashboard

Use a dashboard shell with:

- sidebar
- top bar
- KPI cards
- course table/cards
- quick actions
- publishing status
- recent activity where real data exists

Analytics should visually present existing server-derived data without changing the `getAnalytics` logic.

## Course builder

Make the seven-field publish gate obvious.

Use:

- progress/checklist
- section navigation
- autosave/save state if already supported
- media preview
- chapter list
- drag/drop affordance
- publish readiness state
- destructive actions separated visually

## Quiz builder

Make question/option editing easy to scan.

Clearly distinguish:

- question
- options
- correct answer
- publish state
- delete action

Do not change quiz APIs.

---

# Component architecture

Before creating new UI, search for reusable components.

Prefer reusable components such as:

- AppShell
- Navbar
- Sidebar
- PageHeader
- SectionHeader
- CourseCard
- CourseGrid
- CategoryCard
- Rating
- Price
- ProgressBar
- EmptyState
- Skeleton
- ErrorState
- Modal
- ConfirmDialog
- Tabs
- Badge
- Button
- Input
- Select
- Textarea
- Avatar
- Breadcrumb
- StatCard

Do not create five slightly different versions of the same component.

---

# Interaction quality

Add subtle, purposeful motion:

- card hover elevation
- button press feedback
- tab transitions
- accordion transitions
- sidebar transitions
- progress animations
- skeleton shimmer where appropriate

Keep animations fast and restrained.

Respect `prefers-reduced-motion`.

Avoid animation on every element.

---

# Responsive QA

Every redesigned route must work at:

- 1440px
- 1280px
- 1024px
- 768px
- 390px
- 360px

Check for:

- overflow
- clipped text
- broken grids
- inaccessible buttons
- sticky elements covering content
- unusable dialogs
- mobile navigation issues

---

# Accessibility

Maintain or improve:

- keyboard navigation
- visible focus states
- semantic headings
- button labels
- form labels
- sufficient contrast
- alt text
- aria labels where needed
- reduced motion support

Never remove accessibility to achieve visual similarity.

---

# Verification workflow

Before changing code:

1. Inspect the repository.
2. Identify the existing design system/components.
3. Map routes to components.
4. Identify protected functionality.
5. Start the app.
6. Capture baseline screenshots of representative routes.

Then:

1. Build the design system.
2. Redesign the global shell/navigation.
3. Redesign public marketplace.
4. Redesign course detail.
5. Redesign learner experience.
6. Redesign tutor experience.
7. Redesign forms/modals/states.
8. Test responsive behavior.
9. Run lint/typecheck/build/tests.
10. Use the browser to verify important flows.

Prioritize visual QA over blindly editing many files.

---

# Functional regression checklist

After the redesign verify at minimum:

### Authentication
- Google login
- GitHub login
- sign out
- first-login role selection
- role persistence

### Learner
- browse courses
- course detail
- free preview
- coupon validation
- checkout
- purchase
- paid chapter lock/unlock
- video progress
- notes
- Q&A
- quiz submission
- certificate
- rating/review

### Tutor
- create course
- edit course
- add/reorder chapters
- edit chapter
- upload resource/media
- quiz CRUD
- publish/unpublish
- delete course
- analytics

### Security
Confirm all existing authorization checks remain intact.

---

# Agent behavior

Do not perform a giant uncontrolled rewrite.

Work in phases.

At the beginning, produce a short UI audit:

- current strengths
- biggest visual problems
- duplicated styles
- missing responsive states
- proposed design system
- route-by-route implementation plan

Then implement phase by phase.

After each major phase:

- run the app
- inspect the browser
- compare against the reference direction
- fix visual regressions
- verify functionality

When finished, provide:

- files changed
- design system created/updated
- routes redesigned
- functional checks performed
- known limitations
- commands used for verification

If the agent cannot verify something, say so instead of claiming it passed.

---

# Reference principle

The supplied screenshots are visual references only.

Extract principles from them:

- strong hero composition
- editorial typography
- generous whitespace
- clear section rhythm
- attractive course cards
- meaningful statistics
- category discovery
- educator credibility
- testimonials
- FAQ
- final CTA
- polished footer

Do not clone the screenshots.

The final product must look like a coherent original LMS, not a collage of the references.
