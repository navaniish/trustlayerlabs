# PRD — TrustLayerLabs Quotation & Invoice Management Web App

**Product Name:** TrustLayerDocs  
**Product Type:** B2B Quotation & Invoice Management SaaS  
**Brand:** TrustLayerLabs  
**Version:** 1.0  
**Primary Users:** Founders, sales teams, finance teams, consultants, service businesses  
**Target:** Web / Desktop-first, responsive mobile

---

## 1. Product Vision

Build a professional web application that allows businesses to **create, customize, send, track, approve, and manage quotations and invoices** from one place.

The application should feel less like a traditional accounting application and more like a **premium document-generation workspace**.

### Core philosophy

> **Create → Send → Approve → Invoice → Track → Get Paid**

The application should generate documents that look professional enough to send directly to enterprise clients.

---

# 2. Core Modules

| Module | Purpose |
|---|---|
| Dashboard | Business overview |
| Clients | Manage customer information |
| Products & Services | Maintain reusable items |
| Quotations | Create and manage quotations |
| Invoices | Create and manage invoices |
| Payments | Track payment status |
| Templates | Customize document designs |
| PDF Generator | Generate professional PDFs |
| E-Signature | Client acceptance/signatures |
| Email | Send quotations/invoices |
| Reports | Revenue and document analytics |
| Settings | Business configuration |
| User Management | Team access and permissions |

---

# 3. Dashboard

The dashboard should immediately show the business owner what is happening.

### KPI Cards

```text
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ TOTAL REVENUE   │ │ OUTSTANDING     │ │ QUOTATIONS      │
│ ₹8,45,000       │ │ ₹2,15,000       │ │ 24              │
│ ↑ 18.5%         │ │ 6 invoices      │ │ 8 pending       │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

### Dashboard sections

- Revenue this month
- Revenue this year
- Outstanding invoices
- Overdue invoices
- Pending quotations
- Accepted quotations
- Rejected quotations
- Recent activity
- Upcoming payments
- Recent clients

### Charts

- Monthly revenue
- Quotation conversion
- Invoice payment status
- Revenue by service
- Revenue by client

---

# 4. Business Profile

During onboarding, the user creates their business profile.

### Company information

```text
Company Name
Legal Name
Logo
Company Address
Country
State
City
PIN / ZIP
GSTIN
PAN
CIN
Website
Email
Phone
WhatsApp
Bank Details
UPI ID
```

### Branding

Users can configure:

- Primary color
- Secondary color
- Font
- Logo
- Footer
- Signature
- Company slogan
- Social links

### TrustLayerLabs default branding

```text
TrustLayerLabs

THE VERIFIED TRUST LAYER

TRUST IS NOT ASSUMED.
TRUST IS TESTED.
TRUST IS VERIFIED.
```

---

# 5. Client Management

## Client List

Table:

| Client | Contact | Email | Documents | Outstanding | Status |
|---|---|---|---:|---:|---|
| ABC Technologies | John | john@abc.com | 12 | ₹45,000 | Active |
| XYZ Solutions | Sarah | sarah@xyz.com | 7 | ₹0 | Active |

### Client profile

```text
Company
Contact Person
Designation
Email
Phone
WhatsApp
Billing Address
Shipping Address
GSTIN
PAN
Notes
```

### Client document history

Show:

- Quotations
- Invoices
- Payments
- Credit notes
- Communication history

---

# 6. Products & Services

Users should not repeatedly type service information.

### Product/service database

| Service | Description | Unit | Price | Tax |
|---|---|---|---:|---:|
| Security Assessment | Complete security assessment | Project | ₹50,000 | 18% |
| VAPT | Web/API penetration testing | Project | ₹75,000 | 18% |
| Cloud Security | Cloud infrastructure assessment | Project | ₹45,000 | 18% |

### Supported units

- Hour
- Day
- Project
- Month
- License
- Unit
- Custom

---

# 7. Quotation Management

## Create Quotation

Quotation creation should use a **step-by-step interface**.

### Step 1 — Client

```text
Select Existing Client
       OR
Create New Client
```

### Step 2 — Quotation Information

```text
Quotation Number
Issue Date
Valid Until
Currency
Reference
Salesperson
Payment Terms
```

Automatic quotation number:

```text
TLQ-2026-0001
TLQ-2026-0002
TLQ-2026-0003
```

---

# 8. Quotation Builder

This is the core feature.

### Layout

```text
┌─────────────────────────────────────────────────────────┐
│                 QUOTATION BUILDER                       │
├─────────────────────────────────────────────────────────┤
│ Client                     │ Quote Details              │
│ ABC Technologies           │ #TLQ-2026-001              │
│ John Smith                  │ 17 Sep 2026                │
├─────────────────────────────────────────────────────────┤
│ SERVICES                                                 │
├────┬──────────────┬──────┬───────────┬───────────────┤
│ #  │ Description  │ Qty  │ Unit Price│ Total         │
├────┼──────────────┼──────┼───────────┼───────────────┤
│ 01 │ VAPT         │ 1    │ ₹75,000   │ ₹75,000       │
│ 02 │ Cloud Audit  │ 1    │ ₹45,000   │ ₹45,000       │
├────┴──────────────┴──────┴───────────┴───────────────┤
│                         Subtotal          ₹1,20,000    │
│                         Discount            ₹5,000     │
│                         Tax                 ₹20,700     │
│                         TOTAL              ₹1,35,700   │
└─────────────────────────────────────────────────────────┘
```

### Line-item functionality

Users can:

- Add item
- Remove item
- Duplicate item
- Reorder item
- Search services
- Add custom service
- Apply item discount
- Apply item tax
- Add description
- Add deliverables
- Add timeline

---

# 9. Advanced Quotation Table

Support the professional design requested for TrustLayerLabs.

### Columns

```text
#
Service / Solution
Description
Deliverables
Qty
Unit Price
Discount
Tax
Total
```

Example:

| # | Service | Description | Deliverables | Qty | Price | Total |
|---|---|---|---|---:|---:|---:|
| 01 | Security Assessment | Security review | Report, Risk Register | 1 | ₹50,000 | ₹50,000 |
| 02 | VAPT | Web/API testing | Findings Report | 1 | ₹75,000 | ₹75,000 |

---

# 10. Pricing Engine

The calculation engine must automatically calculate:

```text
Line Total
Subtotal
Item Discount
Global Discount
Taxable Amount
CGST
SGST
IGST
Other Tax
Round Off
Grand Total
```

### India GST support

Support:

```text
CGST
SGST
IGST
UTGST
GST Exempt
Custom Tax
```

Example:

```text
Subtotal                    ₹1,00,000
Discount                      ₹5,000
Taxable Amount               ₹95,000

CGST @ 9%                     ₹8,550
SGST @ 9%                     ₹8,550

Grand Total                 ₹1,12,100
```

---

# 11. Quotation Templates

Create a template marketplace inside the application.

### Template categories

```text
Modern
Minimal
Corporate
Enterprise
Technology
Cybersecurity
Creative
Professional
Dark
Luxury
```

### TrustLayerLabs templates

The default templates should use:

- TL logo
- Navy
- Electric blue
- White
- Light gray
- Strong table borders
- Centered QUOTATION heading
- Large whitespace
- Professional typography
- Human-friendly messaging

---

# 12. Live Document Preview

The most important UX feature:

### Split screen

```text
┌───────────────────────┬─────────────────────────────┐
│                       │                             │
│    EDITOR             │       LIVE PREVIEW          │
│                       │                             │
│ Client                 │      TRUSTLAYERLABS        │
│ Services               │                             │
│ Pricing                │        QUOTATION            │
│ Terms                  │                             │
│ Branding               │      Service Table         │
│                       │                             │
└───────────────────────┴─────────────────────────────┘
```

Every change should immediately update the preview.

---

# 13. Human Psychology Design System

The document builder should use psychological principles without becoming manipulative.

### Visual hierarchy

**Level 1**

```text
QUOTATION
TOTAL AMOUNT
CLIENT NAME
```

**Level 2**

```text
Scope of Work
Financial Summary
Terms & Conditions
```

**Level 3**

```text
Descriptions
Metadata
Supporting information
```

### Design principles

- High readability
- Generous whitespace
- Clear grouping
- Consistent alignment
- Strong contrast
- Familiar icons
- Limited color palette
- Important numbers visually separated
- Avoid information overload
- Human-friendly wording instead of excessive technical jargon

---

# 14. Invoice Management

After a quotation is accepted:

```text
Quotation
     ↓
Accepted
     ↓
Convert to Invoice
     ↓
Invoice Generated
     ↓
Sent to Client
     ↓
Payment
     ↓
Paid
```

### Invoice fields

```text
Invoice Number
Invoice Date
Due Date
Client
Billing Address
Shipping Address
Items
Quantity
Price
Tax
Discount
Total
Payment Instructions
Bank Details
Notes
Terms
```

Automatic invoice number:

```text
INV-2026-0001
INV-2026-0002
```

---

# 15. Invoice Status

```text
DRAFT
SENT
VIEWED
PARTIALLY PAID
PAID
OVERDUE
CANCELLED
```

Color-coded status badges can make the state immediately understandable.

---

# 16. Payment Tracking

### Payment record

```text
Invoice
Payment Date
Amount
Payment Method
Transaction ID
Reference
Notes
```

### Payment methods

- Bank Transfer
- UPI
- Cash
- Card
- Online Payment
- Cheque
- Other

---

# 17. Online Client Portal

Each quotation/invoice can have a secure client link.

Example:

```text
https://app.trustlayerlabs.com/q/TLQ-2026-001
```

Client sees:

```text
TrustLayerLabs

QUOTATION

Prepared for:
ABC Technologies

₹1,35,700

[ Download PDF ]

[ Accept Quotation ]

[ Request Changes ]

[ Contact Us ]
```

---

# 18. Quotation Approval

Client can:

### Accept

```text
✓ I accept this quotation

Name
Designation
Signature
Date

[ ACCEPT QUOTATION ]
```

### Request Changes

```text
What would you like to change?

[____________________________]

[ SEND REQUEST ]
```

The system records the complete activity.

---

# 19. E-Signature

Support:

- Draw signature
- Type signature
- Upload signature
- Date/time
- IP logging
- Acceptance timestamp

Document status:

```text
Accepted ✓
Signed ✓
```

---

# 20. PDF Generation

Generate professional PDFs in:

- A4
- Letter
- Portrait
- Landscape

### PDF features

- High-resolution logo
- Company branding
- Page numbers
- Header
- Footer
- Watermark
- Terms
- Signature
- QR code
- Payment QR
- Document verification QR

---

# 21. Document Verification

A special TrustLayerLabs feature.

Each quotation/invoice receives a unique verification ID.

```text
Document ID:
TLQ-2026-0001

Verification:
✓ VERIFIED DOCUMENT

Verify at:
verify.trustlayerlabs.com/TLQ-2026-0001
```

QR code opens the verification page.

This aligns particularly well with the **TrustLayerLabs** brand concept.

---

# 22. Email System

Users can send documents directly from the application.

### Email template

**Subject:**

```text
Quotation TLQ-2026-0001 from TrustLayerLabs
```

Body:

```text
Hi [Client Name],

Thank you for the opportunity to work with you.

Please find attached quotation [Quotation Number]
for [Project / Service].

The quotation is valid until [Date].

Please let us know if you have any questions.

Regards,
[Name]
TrustLayerLabs
```

Attachments:

```text
Quotation.pdf
```

---

# 23. Automated Email Notifications

| Event | Notification |
|---|---|
| Quotation created | Internal |
| Quotation sent | Client |
| Quotation viewed | Sales team |
| Quotation accepted | Sales + Admin |
| Change requested | Sales |
| Invoice generated | Client |
| Invoice due soon | Client |
| Invoice overdue | Client + Admin |
| Payment received | Admin |

---

# 24. Reports

### Financial reports

- Total revenue
- Paid invoices
- Outstanding invoices
- Overdue invoices
- Monthly revenue
- Annual revenue
- Revenue by client
- Revenue by service

### Sales reports

- Quotations created
- Quotations sent
- Quotations accepted
- Quotations rejected
- Conversion rate
- Average quotation value

---

# 25. Search

Global search:

```text
Search clients, quotations, invoices,
services, payments...
```

Example:

```text
TLQ-2026-001
ABC Technologies
₹75,000
John Smith
VAPT
```

---

# 26. Activity Timeline

Every document should maintain an audit trail.

```text
17 Sep 2026 — Quotation created
17 Sep 2026 — Quotation edited
17 Sep 2026 — Sent to client
18 Sep 2026 — Client viewed
18 Sep 2026 — Client accepted
19 Sep 2026 — Invoice generated
25 Sep 2026 — Payment received
```

---

# 27. User Roles

### Owner

Full access.

### Admin

Manage:

- Clients
- Quotations
- Invoices
- Payments
- Templates

### Sales

Manage:

- Clients
- Quotations
- Customers

### Finance

Manage:

- Invoices
- Payments
- Reports

### Viewer

Read-only access.

---

# 28. Authentication

Support:

```text
Email + Password
Google Login
OTP
Forgot Password
Email Verification
Two-Factor Authentication
```

---

# 29. Database Architecture

Recommended PostgreSQL schema:

```text
users
organizations
organization_members
business_profiles

clients
client_contacts

products
services
tax_rates

quotations
quotation_items
quotation_templates
quotation_versions

invoices
invoice_items

payments
payment_transactions

documents
document_signatures
document_views

emails
notifications

expenses
audit_logs

subscriptions
```

### Relationship

```text
Organization
     │
     ├── Users
     ├── Clients
     ├── Services
     ├── Quotations
     │      └── Quotation Items
     │
     └── Invoices
            └── Invoice Items
```

---

# 30. Recommended Tech Stack

## Frontend

```text
React
TypeScript
Vite
Tailwind CSS
shadcn/ui
React Hook Form
Zustand
TanStack Query
```

## Backend

Recommended:

```text
FastAPI
Python
PostgreSQL
SQLAlchemy
Pydantic
Redis
Celery
```

Alternative:

```text
Node.js
NestJS
PostgreSQL
Prisma
```

---

# 31. PDF Architecture

Use a dedicated PDF service.

```text
React Editor
      ↓
Document JSON
      ↓
Backend
      ↓
PDF Renderer
      ↓
PDF
      ↓
Storage
```

Possible renderer:

```text
HTML/CSS
     ↓
Playwright
     ↓
PDF
```

This allows the PDF to closely match the web preview.

---

# 32. File Storage

Store:

- Logos
- Signatures
- Generated PDFs
- Attachments
- Template assets

Recommended:

```text
AWS S3
Cloudflare R2
Supabase Storage
```

---

# 33. API Design

### Clients

```http
GET    /api/clients
POST   /api/clients
GET    /api/clients/{id}
PUT    /api/clients/{id}
DELETE /api/clients/{id}
```

### Quotations

```http
GET    /api/quotations
POST   /api/quotations
GET    /api/quotations/{id}
PUT    /api/quotations/{id}
DELETE /api/quotations/{id}

POST /api/quotations/{id}/send
POST /api/quotations/{id}/accept
POST /api/quotations/{id}/reject
POST /api/quotations/{id}/duplicate
POST /api/quotations/{id}/convert-to-invoice
```

### Invoices

```http
GET  /api/invoices
POST /api/invoices
GET  /api/invoices/{id}
PUT  /api/invoices/{id}

POST /api/invoices/{id}/send
POST /api/invoices/{id}/payment
```

---

# 34. Document JSON Structure

The document engine should store documents as structured JSON.

```json
{
  "type": "quotation",
  "number": "TLQ-2026-0001",
  "client": {
    "name": "ABC Technologies",
    "email": "client@example.com"
  },
  "items": [
    {
      "name": "VAPT (Web & API)",
      "description": "Security testing",
      "quantity": 1,
      "unit_price": 75000,
      "tax": 18
    }
  ],
  "discount": 5000,
  "currency": "INR",
  "template": "trustlayer-modern"
}
```

This makes templates reusable.

---

# 35. Template Engine

Separate:

```text
Document Data
      +
Template
      +
Brand Settings
      ↓
Rendered Document
```

This allows the same quotation data to be displayed using:

```text
Template A — Corporate
Template B — Minimal
Template C — Cybersecurity
Template D — Enterprise
```

without changing the actual quotation.

---

# 36. Security Requirements

Because TrustLayerLabs operates in the security space, the application itself should demonstrate strong security practices.

### Required

- HTTPS
- Password hashing
- JWT/session security
- RBAC
- Input validation
- SQL injection protection
- XSS protection
- CSRF protection where applicable
- Rate limiting
- Secure file uploads
- Signed document URLs
- Audit logs
- Encryption at rest
- Encryption in transit
- Secure secrets management
- Automatic backups

---

# 37. Admin Panel

Admin dashboard:

```text
Users
Organizations
Documents
Templates
Payments
Subscriptions
System Logs
Security Logs
Email Logs
```

Admin can:

- Suspend users
- Manage templates
- View document statistics
- Configure system settings
- Review failed emails
- Manage subscriptions

---

# 38. SaaS Pricing Architecture

Potential subscription structure:

| Plan | Target |
|---|---|
| Free | Individuals |
| Starter | Freelancers |
| Professional | Small businesses |
| Business | Growing companies |
| Enterprise | Large organizations |

Possible limits:

```text
Quotations/month
Invoices/month
Users
Templates
Storage
PDF generation
E-signatures
Custom branding
Client portal
API access
```

---

# 39. MVP

Do **not** build everything initially.

### MVP should contain:

```text
✓ Authentication
✓ Business Profile
✓ Client Management
✓ Products/Services
✓ Quotation Builder
✓ Professional Templates
✓ Live Preview
✓ PDF Generation
✓ Invoice Creation
✓ Quotation → Invoice conversion
✓ Email sending
✓ Payment status
✓ Dashboard
```

### Phase 2

```text
✓ Client Portal
✓ Online Acceptance
✓ E-signatures
✓ Payment Gateway
✓ Document Verification
✓ Advanced Analytics
✓ Recurring invoices
```

### Phase 3

```text
✓ AI quotation assistant
✓ AI invoice assistant
✓ WhatsApp integration
✓ Accounting integrations
✓ GST automation
✓ API
✓ Mobile application
```

---

# 40. AI Features

A future differentiator can be an **AI Document Assistant**.

User types:

> "Create a quotation for a website development project worth ₹1.5 lakh with 40% advance and 60% on completion."

AI generates:

```text
Client
Services
Scope
Pricing
Payment terms
Validity
Professional description
Quotation
```

### AI commands

```text
"Make this quotation more professional."

"Reduce the description."

"Add payment terms."

"Create invoice from this quotation."

"Translate this quotation to Telugu."

"Generate an email for this quotation."

"Explain this quotation to the client."
```

---

# 41. UI Navigation

```text
┌──────────────────────────────────────┐
│ TrustLayerDocs              Profile  │
├──────────────┬───────────────────────┤
│              │                       │
│ Dashboard    │                       │
│              │                       │
│ Quotations   │      WORKSPACE        │
│              │                       │
│ Invoices     │                       │
│              │                       │
│ Clients      │                       │
│              │                       │
│ Services     │                       │
│              │                       │
│ Payments     │                       │
│              │                       │
│ Templates    │                       │
│              │                       │
│ Reports      │                       │
│              │                       │
│ Settings     │                       │
└──────────────┴───────────────────────┘
```

---

# 42. Homepage

The public landing page should communicate the product in seconds.

### Hero

> **Create Quotations. Send Invoices. Get Paid.**

Subheading:

> Professional business documents designed, generated, and managed from one workspace.

Buttons:

```text
[ Create Free Account ]
[ View Demo ]
```

### Feature sections

```text
Beautiful Quotations
Professional Invoices
Instant PDF
Client Approval
Payment Tracking
Document Verification
```

---

# 43. Key User Journey

### New business

```text
Sign Up
   ↓
Create Business Profile
   ↓
Upload Logo
   ↓
Choose Template
   ↓
Add Client
   ↓
Add Services
   ↓
Create Quotation
   ↓
Preview
   ↓
Generate PDF
   ↓
Send
   ↓
Client Accepts
   ↓
Convert to Invoice
   ↓
Track Payment
```

---

# 44. Success Metrics

### Product metrics

- Quotations created/month
- Invoices created/month
- PDF downloads
- Quotations sent
- Quotation acceptance rate
- Invoice payment rate
- Active businesses
- Monthly recurring revenue
- Client portal usage

### UX metrics

- Time to create quotation
- Time to create invoice
- Template usage
- Document completion rate

**Target MVP:** A new user should be able to create a professional quotation in **under 5 minutes**.

---

# 45. Final Product Positioning

Instead of positioning the product as another accounting application, position it around:

> **Professional business documents for modern companies.**

The differentiator is the combination of:

**Beautiful design + quotation workflow + invoice workflow + client approval + document verification + automation.**

For TrustLayerLabs specifically, the visual identity should consistently use the existing **TL logo**, centered **QUOTATION** header style, strong table borders, navy/blue palette, generous top whitespace, and the **“THE VERIFIED TRUST LAYER”** brand language.

### Suggested product architecture

```text
                  TRUSTLAYERDOCS
                         │
       ┌─────────────────┼─────────────────┐
       │                 │                 │
   QUOTATIONS         INVOICES          CLIENTS
       │                 │                 │
       └──────────────┬──┴─────────────────┘
                         │
                   DOCUMENT ENGINE
                         │
             ┌───────────┼───────────┐
             │           │           │
          PDF          EMAIL       E-SIGN
             │           │           │
             └───────────┼───────────┘
                         │
                   PAYMENT TRACKING
                         │
                    ANALYTICS
```

**Recommended MVP name:** **TrustLayerDocs**  
**Tagline:** **“Professional Documents. Verified Trust.”**
