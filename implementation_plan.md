# Implementation Plan - Campus Connect MVP Frontend

Create a modern, professional, fully responsive HTML/CSS frontend for college students called **Campus Connect**.

## User Review Required

> [!IMPORTANT]
> The target folder structure requires all core HTML files to be located in the root of the project instead of a `pages/` subfolder. Unused pages (notes, chat, forum, clubs, placements) will be removed from the MVP.
> There is no JavaScript allowed; interactive components like mobile navigation, sidebars, dropdowns, and modals will be driven purely by CSS (e.g. checkbox hack, `:target` anchor selectors, and details/summary elements).

## Proposed Changes

We will restructure the project from `c:\Users\Vatsal\Desktop\campus connect` to match the exact MVP specifications.

---

### Stylesheets Component

We will combine existing CSS structures and refactor them into three files inside `css/`:
* `css/style.css` (variables, base, layout, utility, and basic components)
* `css/pages.css` (page-specific layout and styles: landing, dashboard grids, profile tabs, confessions feed)
* `css/responsive.css` (media queries for fluid layout adaptability across mobile, tablet, and desktop)

#### [NEW] [style.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/style.css)
Consolidate variables, base styling, common components (buttons, badges, forms, empty states, modals, skeleton loaders), and sidebar/navbar layout.

#### [MODIFY] [pages.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/pages.css)
Refactor to support only MVP pages (Landing, Dashboard, Auth, Lost & Found, Events, Confessions, Profile, Settings, 404). Add styles for the Anonymous Confessions feed timeline.

#### [NEW] [responsive.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/responsive.css)
Consolidate all media queries to manage the responsive sidebar, responsive margins, masonry columns, grid resizing, and landing page header behavior.

---

### Root HTML Pages

Move and update the pages to the root of the project workspace. Update CSS paths (change `../css/` to `css/`) and relative file references.

#### [MODIFY] [index.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/index.html)
* Update navigation links to login, register, and dashboard.
* Remove non-MVP features (Notes Vault, Discussion Forum, Clubs & Societies, Placement Services, Chat).
* Add a "Why Campus Connect" section detailing key benefits.
* Update stats to show MVP-relevant metrics.
* Update footer links.

#### [NEW] [login.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/login.html)
Create beautiful centered login card with Email, Password inputs, "Login" & "Continue with Google" buttons, and links for resetting password or registering.

#### [NEW] [register.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/register.html)
Create card for registration with: Full Name, Enrollment Number, Department, Semester, Email, Password, Confirm Password.

#### [NEW] [dashboard.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/dashboard.html)
Adapt the dashboard. Remove non-MVP sidebar links (Notes, Papers, Forum, Clubs, Placements, Announcements, Chat). Render quick actions and widgets for Recent Lost Items, Upcoming Events, and Latest Confessions.

#### [NEW] [lost-found.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/lost-found.html)
Adapt Pinterest-style card grid. Update links, filter chips, search input, and CSS-only modal overlays.

#### [NEW] [events.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/events.html)
Adapt events list with search, Category Filter, and tabs for "Upcoming Events" vs "Past Events".

#### [NEW] [confessions.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/confessions.html)
Create anonymous confession timeline feed. Display disclaimer at top, list category chips (Funny, Relationship, College Life, Exams, Hostel, General), and add a button to write a confession (linked to a CSS-only modal). Confession cards contain anonymous avatar, "Anonymous Student" username, timestamp, and interaction triggers (Like, Comment, Share, Report).

#### [NEW] [profile.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/profile.html)
Modify profile page. Show cover banner, avatar, details (Name, Dept, Semester, Bio). Statistics card shows Events Joined, Lost Items Reported, Found Items Returned. Tabs list items user has interacted with (e.g. reported lost items, registered events).

#### [NEW] [settings.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/settings.html)
Adapt settings page to link correctly. Keep Account, Privacy, Notifications, Appearance, and Security sub-panels.

#### [NEW] [404.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/404.html)
Create clean 404 landing block with a "Back to Home" button.

---

### Clean Up Exclusions

Delete unused legacy HTML files in `pages/` and the old CSS stylesheets.

#### [DELETE] [admin.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/admin.html)
#### [DELETE] [announcements.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/announcements.html)
#### [DELETE] [chat.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/chat.html)
#### [DELETE] [clubs.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/clubs.html)
#### [DELETE] [event-details.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/event-details.html)
#### [DELETE] [forum.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/forum.html)
#### [DELETE] [notes.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/notes.html)
#### [DELETE] [notifications.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/notifications.html)
#### [DELETE] [papers.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/papers.html)
#### [DELETE] [placements.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/placements.html)
#### [DELETE] [question-details.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/question-details.html)
#### [DELETE] [upload-notes.html](file:///c:/Users/Vatsal/Desktop/campus%20connect/pages/upload-notes.html)
#### [DELETE] [base.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/base.css)
#### [DELETE] [components.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/components.css)
#### [DELETE] [layout.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/layout.css)
#### [DELETE] [variables.css](file:///c:/Users/Vatsal/Desktop/campus%20connect/css/variables.css)

---

## Verification Plan

### Automated Check
* Verify all CSS links exist and references are valid.
* Run a local HTTP server to preview all pages.

### Manual Verification
* Inspect layout on various viewport widths: desktop (1440px), tablet (768px), and mobile (375px) via local browser checks.
* Click all links to confirm page navigation links resolve correctly to root folder.
* Open modals (Lost & Found report, Confession report) and dropdowns to confirm interactive elements behave correctly via CSS hacks.
