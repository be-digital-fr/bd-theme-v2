# Admin Dashboard Functionality Testing Guide

## Test Overview
This document provides a comprehensive testing guide for the admin dashboard functionality of the Be Digital restaurant theme.

## Prerequisites
- Development server running on http://localhost:3002
- Test admin user credentials: `admin@test.local` / `testpass123`

## Test Plan

### 1. Authentication & Access Control
**Test Steps:**
1. Navigate to http://localhost:3002
2. Click on the user menu (top right)
3. Select "Sign In" if not authenticated
4. Sign in with admin credentials:
   - Email: `admin@test.local`
   - Password: `testpass123`
5. Verify the "Administration" link appears in the user menu (Shield icon)

**Expected Results:**
- Successful authentication
- User menu shows admin-specific options
- "Administration" link visible only for admin/employee roles

### 2. Admin Dashboard Navigation
**Test Steps:**
1. Click on "Administration" in the user menu
2. Verify redirect to `/admin` dashboard
3. Check dashboard loads without errors
4. Verify sidebar navigation is present and responsive

**Expected Results:**
- Dashboard loads successfully
- Header shows "Tableau de bord administrateur"
- Sidebar contains navigation sections:
  - Navigation (Dashboard, Analytics)
  - Gestion du contenu (Vue d'ensemble, Éditorial, Vidéos, Textes, Images)
  - Configuration (Préférences)

### 3. Dashboard Content Verification
**Test Steps:**
1. Verify statistics cards display:
   - Utilisateurs totaux: 156 (+12 cette semaine)
   - Commandes: 89 (5 en attente)
   - Produits: 45 (3 stock faible)
   - Chiffre d'affaires: €4,567.89 (+12.5%)
2. Check "Commandes récentes" section shows 5 mock orders
3. Verify "Alertes système" displays notifications
4. Test "Actions rapides" buttons are present

**Expected Results:**
- All statistics display correctly with French formatting
- Recent orders section populated with mock data
- System alerts showing stock warnings and user notifications
- Quick action buttons responsive to hover

### 4. Sidebar Navigation Testing
**Test Steps:**
1. Test each sidebar navigation item:
   - Dashboard (`/admin`)
   - Analytics (`/admin/analytics`) - may show 404
   - Vue d'ensemble (`/admin/content`)
   - Éditorial (`/admin/content/editorial`)
   - Vidéos (`/admin/content/videos`)
   - Textes (`/admin/content/texts`)
   - Images (`/admin/content/images`)
   - Préférences (`/admin/settings`)
2. Verify active state highlighting
3. Test sidebar collapse/expand functionality

**Expected Results:**
- Navigation items highlight when active
- Sidebar responsive behavior works
- All implemented pages load without errors
- 404 pages show appropriate error messages for unimplemented features

### 5. Admin Settings Page Testing
**Test Steps:**
1. Navigate to `/admin/settings`
2. Verify settings categories:
   - Préférences multilingues (with "Configurer" button)
   - Gestion des utilisateurs
   - Notifications
   - Sécurité
3. Check system information section
4. Test quick action buttons

**Expected Results:**
- Settings page loads completely
- All configuration cards display status badges
- System information shows mock data
- Action buttons are responsive

### 6. Responsive Design Testing

#### Desktop (1200px+)
**Test Steps:**
1. Test at desktop resolution
2. Verify sidebar is fully visible
3. Check grid layouts display properly
4. Test hover states on interactive elements

#### Tablet (768px - 1199px)
**Test Steps:**
1. Resize browser to tablet width
2. Test sidebar behavior
3. Verify grid columns adjust appropriately
4. Check touch-friendly interface elements

#### Mobile (< 768px)
**Test Steps:**
1. Resize browser to mobile width
2. Verify sidebar converts to hamburger menu
3. Test mobile navigation
4. Check cards stack vertically
5. Test touch interactions

**Expected Results:**
- Sidebar collapses to hamburger menu on mobile
- Cards stack appropriately
- Text remains readable
- Interactive elements are touch-friendly

### 7. Role-Based Access Control
**Test Steps:**
1. Sign out from admin account
2. Sign in with regular user account (if available)
3. Verify "Administration" link does not appear
4. Attempt to directly access `/admin` URL
5. Test with employee role if available

**Expected Results:**
- Regular users cannot see admin menu
- Direct admin URL access redirects to home page
- Only admin/employee roles can access admin areas

## Test Results Template

### ✅ Authentication & Access Control
- [ ] Admin login successful
- [ ] Administration link visible
- [ ] Role-based access working

### ✅ Dashboard Navigation
- [ ] Dashboard loads successfully
- [ ] Sidebar navigation present
- [ ] Header displays correctly

### ✅ Dashboard Content
- [ ] Statistics cards display
- [ ] Recent orders section populated
- [ ] System alerts visible
- [ ] Quick actions responsive

### ✅ Sidebar Navigation
- [ ] All navigation items work
- [ ] Active state highlighting
- [ ] Responsive behavior

### ✅ Settings Page
- [ ] Settings categories display
- [ ] System information shows
- [ ] Action buttons responsive

### ✅ Responsive Design
- [ ] Desktop layout optimal
- [ ] Tablet responsive
- [ ] Mobile navigation works

### ✅ Access Control
- [ ] Regular users blocked
- [ ] Direct URL protection
- [ ] Role verification

## Known Issues
- Analytics page not implemented (expected 404)
- Settings buttons are mockups (no functionality)
- Statistics are hardcoded mock data
- Some content pages may be placeholders

## Architecture Notes
- Clean Architecture implementation with features/admin structure
- Role-based access control via Better Auth
- Server-side protection using requireAdmin() action
- Responsive design using Tailwind CSS v4 and shadcn/ui components