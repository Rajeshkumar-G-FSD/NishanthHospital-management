# 🏥 Nishanth Hospital — Enterprise Hospital Management System (HMS)

> **A modern, enterprise-grade Hospital Management System built with Next.js 15, Firebase & TypeScript.**

---

## 🧱 Technology Stack

| Layer | Technology |
|-------|-----------|
| 🖥️ **Frontend** | Next.js 15 + TypeScript + Tailwind CSS + ShadCN UI |
| 🔥 **Backend** | Firebase (BaaS) |
| 🗄️ **Database** | Cloud Firestore |
| 🔐 **Authentication** | Firebase Auth |
| 📦 **Storage** | Firebase Storage |
| 🔔 **Notifications** | Firebase Cloud Messaging |
| 🌐 **Hosting** | Firebase Hosting |
| 📊 **Analytics** | Firebase Analytics |

---

## 🏨 Supported Specialties & Departments

| Icon | Specialty |
|------|-----------|
| 🔬 | Multi-specialty Hospital |
| 🧬 | Fertility Center |
| 🤰 | Obstetrics & Gynaecology |
| 🧪 | Urology & Andrology |
| 👶 | Pediatrics & Neonatology |
| 🚨 | Emergency Care |
| 🏥 | OPD (Out-Patient Department) |
| 🛏️ | IPD (In-Patient Department) |
| 🔭 | Laboratory |
| 💊 | Pharmacy |
| 💰 | Billing |
| 👔 | Human Resources |
| 🤝 | CRM |
| 👤 | Patient Portal |
| 👨‍⚕️ | Doctor Portal |
| 🛡️ | Super Admin Panel |

---

## ✅ Universal Module Capabilities

Every module supports the following operations out of the box:

| Capability | Description |
|-----------|-------------|
| ➕ **Create** | Add new records |
| 📖 **Read** | View & list records |
| ✏️ **Update** | Edit existing records |
| 🗑️ **Delete** | Remove records (soft delete) |
| 🔍 **Search** | Full-text & field-level search |
| 🎛️ **Filters** | Advanced multi-field filtering |
| 📄 **Export PDF** | Generate printable PDF reports |
| 📊 **Export Excel** | Export to spreadsheet formats |
| 📜 **Audit Logs** | Complete activity trail |
| ♻️ **Soft Delete** | Non-destructive deletion |
| 🔄 **Restore Records** | Recover deleted records |
| 🔒 **Role Permissions** | Granular RBAC per module |

---

# 👥 User Roles & Access Control

| Role | Icon | Access Level |
|------|------|-------------|
| **Super Admin** | 🛡️ | Full System Access |
| **Hospital Admin** | 🏥 | Hospital Operations |
| **Doctor** | 👨‍⚕️ | Patient Management |
| **Nurse** | 👩‍⚕️ | Ward Management |
| **Receptionist** | 🗂️ | Appointments & Registration |
| **Lab Technician** | 🔬 | Laboratory Module |
| **Pharmacist** | 💊 | Pharmacy Module |
| **Accountant** | 💼 | Billing & Finance |
| **Patient** | 👤 | Patient Portal Only |

---

# 📋 Admin Panel Modules

---

## 📊 Dashboard

### Stat Widgets

| Widget | Icon |
|--------|------|
| Total Patients | 👥 |
| Today's Appointments | 📅 |
| Revenue | 💰 |
| Active Doctors | 👨‍⚕️ |
| Total Staff | 👔 |
| Occupied Beds | 🛏️ |
| Pending Bills | 📋 |
| Emergency Cases | 🚨 |
| IVF Cycles | 🧬 |
| New Registrations | 📝 |

### 📈 Charts & Analytics
- **Revenue Trends** — Monthly/Quarterly/Yearly
- **Appointment Trends** — Daily/Weekly/Monthly
- **Department Performance** — Per-specialty metrics
- **Doctor Performance** — Consultations & outcomes

---

## 📅 Appointment Management

**Collection:** `appointments`

| Field | Type | Description |
|-------|------|-------------|
| `appointmentId` | string | Unique identifier |
| `patientId` | ref | Linked patient |
| `doctorId` | ref | Assigned doctor |
| `departmentId` | ref | Department |
| `appointmentDate` | date | Scheduled date |
| `appointmentTime` | time | Scheduled time |
| `consultationType` | enum | OPD / Video / Walk-in |
| `status` | enum | Pending / Confirmed / Cancelled |
| `notes` | text | Additional notes |

### ✨ Features
- 🌐 Online Booking
- 🚶 Walk-In Booking
- 🎥 Video Consultation
- 🔁 Reschedule
- ❌ Cancel
- 🔄 Follow-up Scheduling

---

## 🧑‍⚕️ Patient Management

**Collection:** `patients`

| Field | Type |
|-------|------|
| `patientCode` | string |
| `UHID` | string |
| `fullName` | string |
| `gender` | enum |
| `DOB` | date |
| `bloodGroup` | enum |
| `mobile` | string |
| `email` | string |
| `address` | object |
| `emergencyContact` | object |
| `insuranceDetails` | object |

### 📁 Sub-Modules
- 📝 Registration
- 📋 Medical History
- 👨‍👩‍👧 Family History
- ⚠️ Allergies
- 📎 Documents Upload

---

## 👨‍⚕️ Doctor Management

**Collection:** `doctors`

| Field | Type |
|-------|------|
| `doctorId` | string |
| `name` | string |
| `specialization` | string |
| `qualification` | string |
| `registrationNumber` | string |
| `experience` | number |
| `consultationFee` | number |
| `availability` | object |

---

## 🏢 Department Management

**Collection:** `departments`

### Departments Supported
| Department | Icon |
|-----------|------|
| Obstetrics & Gynaecology | 🤰 |
| Fertility Centre | 🧬 |
| Urology & Andrology | 🧪 |
| Pediatrics | 👶 |
| Neonatology | 🍼 |
| Anaesthesiology | 💉 |
| Emergency | 🚨 |
| Cardiology | ❤️ |
| Orthopaedics | 🦴 |
| Radiology | 🔭 |

---

## 🏥 OPD Management

**Collection:** `opdVisits`

### Features
- 📝 Registration
- 🩺 Consultation
- 💊 Prescriptions
- 🔄 Follow-up
- 💰 Billing

---

## 🛏️ IPD Management

**Collections:** `admissions` · `wards` · `beds`

### Features
- 🏥 Admission
- 🛏️ Bed Allocation
- 🔄 Ward Transfer
- 🚪 Discharge Summary

---

## 🛏️ Bed Management

**Collection:** `beds`

| Field | Description |
|-------|-------------|
| `bedNumber` | Unique bed identifier |
| `ward` | Assigned ward |
| `status` | Available / Occupied / Maintenance |
| `patientAssigned` | Linked patient ref |

---

## 🚨 Emergency Management

**Collection:** `emergencyCases`

### Features
- 🚑 Emergency Registration
- 🚐 Ambulance Requests
- ⚠️ Critical Case Tracking
- 🏥 ICU Transfer Management

---

## 🔬 Laboratory Management

**Collections:** `labTests` · `labOrders` · `labReports`

### Workflow
```
Test Booking → Sample Collection → Result Entry → Approval → PDF Report
```

### Features
- 📋 Test Booking
- 🧪 Sample Collection Tracking
- 📝 Result Entry
- ✅ Approval Workflow
- 📄 PDF Report Generation

---

## 🔭 Radiology Management

**Collections:** `radiologyOrders` · `radiologyReports`

| Modality | Icon |
|---------|------|
| Ultrasound | 🔊 |
| X-Ray | ☢️ |
| CT Scan | 🖥️ |
| MRI | 🧲 |

---

## 💊 Pharmacy Management

**Collections:** `medicines` · `vendors` · `purchaseOrders` · `sales`

### Features
- 📦 Stock Tracking
- 🏷️ Batch Tracking
- ⏰ Expiry Tracking
- 💰 Integrated Billing

---

## 📦 Inventory Management

**Collection:** `inventory`

### Features
- 🏷️ Assets Management
- 🧴 Consumables Tracking
- 🛒 Purchase Management
- 🔔 Low Stock Alerts

---

## 💰 Billing Management

**Collections:** `invoices` · `payments`

### Billing Types
| Type | Icon |
|------|------|
| OP Billing | 🏥 |
| IP Billing | 🛏️ |
| Pharmacy Billing | 💊 |
| Lab Billing | 🔬 |

---

## 🏦 Insurance Management

**Collections:** `insuranceProviders` · `claims`

### Features
- 🤝 TPA Management
- 📋 Claims Tracking
- ✅ Claim Approvals
- 📊 Claims Analytics

---

## 🧬 IVF / Fertility Management

**Collections:** `ivfPatients` · `ivfCycles` · `embryos`

### Services
| Service | Icon |
|---------|------|
| Couple Registration | 👫 |
| Fertility Assessment | 🔬 |
| IUI | 💉 |
| IVF | 🧬 |
| ICSI | 🔭 |
| Embryo Tracking | 🧫 |

---

## 🏨 OT (Operation Theatre) Management

**Collections:** `surgeries` · `operationTheatres`

### Features
- 📅 Surgery Scheduling
- 🏥 OT Allocation
- 📝 Surgical Notes & Reports

---

## 🍼 NICU Management

**Collection:** `nicuPatients`

### Features
- 📊 Neonatal Monitoring
- 📈 Growth Tracking
- ⚠️ Alert Management

---

## 💉 Vaccination Management

**Collection:** `vaccinations`

### Features
- 👶 Child Immunization Schedule
- 🔔 Due Date Reminders
- 📋 Vaccination Certificate

---

## 👔 HR Management

**Collections:** `employees` · `attendance` · `payroll` · `leaveRequests`

### Features
- 👥 Staff Directory
- ⏰ Attendance Tracking
- 💰 Payroll Processing
- 📅 Shift Scheduling
- 🏖️ Leave Management

---

## 🌐 CMS Management

**Collections:** `pages` · `blogs` · `testimonials` · `gallery` · `banners` · `faqs`

### Website Pages
| Page | Icon |
|------|------|
| Home | 🏠 |
| About Us | ℹ️ |
| Our Doctors | 👨‍⚕️ |
| Departments | 🏢 |
| Services | ⚕️ |
| Fertility Centre | 🧬 |
| Contact Us | 📞 |

---

## 🔔 Notification Management

**Collection:** `notifications`

### Channels
| Channel | Icon |
|---------|------|
| SMS | 📱 |
| Email | 📧 |
| WhatsApp | 💬 |
| Push Notifications | 🔔 |

---

## 📊 Reports Module

| Report | Icon |
|--------|------|
| Revenue Report | 💰 |
| Appointment Report | 📅 |
| Doctor Performance | 👨‍⚕️ |
| Department Report | 🏢 |
| Inventory Report | 📦 |
| IVF Success Report | 🧬 |
| Emergency Report | 🚨 |
| Billing Report | 💳 |

### Export Formats
- 📄 PDF
- 📊 Excel / CSV

---

## 📜 Audit Logs

**Collection:** `auditLogs`

| Event | Icon |
|-------|------|
| User Login | 🔐 |
| Record Created | ➕ |
| Record Updated | ✏️ |
| Record Deleted | 🗑️ |
| Approvals | ✅ |

---

## ⚙️ Settings Module

**Collection:** `settings`

| Setting | Icon |
|---------|------|
| Hospital Information | 🏥 |
| Logo Upload | 🖼️ |
| Department Config | 🏢 |
| Working Hours | ⏰ |
| SMS Configuration | 📱 |
| Email Configuration | 📧 |
| Payment Gateway | 💳 |

---

# 🗄️ Firestore Database Structure

```
/users                  👥  Authentication users
/patients               🧑‍⚕️  Patient records
/doctors                👨‍⚕️  Doctor profiles
/departments            🏢  Department config
/appointments           📅  All appointments
/opdVisits              🏥  OPD consultations
/admissions             🛏️  IPD admissions
/beds                   🛏️  Bed inventory
/wards                  🏢  Ward management
/emergencyCases         🚨  Emergency records
/labTests               🔬  Lab test catalog
/labReports             📋  Lab results
/radiologyReports       🔭  Radiology results
/medicines              💊  Medicine catalog
/inventory              📦  Inventory items
/invoices               💰  Billing invoices
/payments               💳  Payment records
/insuranceClaims        🏦  Insurance claims
/ivfCycles              🧬  IVF treatment cycles
/embryos                🧫  Embryo tracking
/surgeries              🏥  Surgical records
/operationTheatres      🏨  OT management
/vaccinations           💉  Vaccination records
/nicuPatients           🍼  NICU records
/employees              👔  Staff profiles
/attendance             ⏰  Attendance logs
/payroll                💰  Payroll records
/leaveRequests          🏖️  Leave applications
/pages                  🌐  CMS pages
/blogs                  📝  Blog posts
/testimonials           💬  Patient testimonials
/gallery                🖼️  Media gallery
/banners                🖼️  Site banners
/faqs                   ❓  FAQ entries
/notifications          🔔  Notification logs
/auditLogs              📜  System audit trail
/settings               ⚙️  System configuration
```

---

# 🔐 Security Architecture

| Layer | Implementation |
|-------|---------------|
| 🔑 **Authentication** | Firebase Auth (Email, OTP, OAuth) |
| 🛡️ **Authorization** | RBAC — Role-Based Access Control |
| 📋 **Data Rules** | Firestore Security Rules |
| 📜 **Audit Trail** | Complete audit logging on all mutations |
| 💾 **Backup** | Scheduled Firestore exports |
| 🏥 **Compliance** | HIPAA-style Data Access Controls |

---

# 🚀 Deliverables

| # | Deliverable | Status |
|---|------------|--------|
| 1 | 🗄️ Complete Database Schema | ⬜ Pending |
| 2 | 🔥 Firestore Collections | ⬜ Pending |
| 3 | 🔷 TypeScript Interfaces | ⬜ Pending |
| 4 | 📁 Next.js Folder Structure | ⬜ Pending |
| 5 | 🎨 Admin Dashboard UI | ⬜ Pending |
| 6 | 📄 CRUD Pages for Every Module | ⬜ Pending |
| 7 | 🧩 Reusable Components Library | ⬜ Pending |
| 8 | 🔒 Firebase Security Rules | ⬜ Pending |
| 9 | 🔌 API Service Layer | ⬜ Pending |
| 10 | 🏗️ Production-Ready Architecture | ⬜ Pending |

---

> 🏥 **Nishanth Hospital Management System** — Built for excellence in healthcare delivery.
> 
> *Powered by Next.js 15 · Firebase · TypeScript · ShadCN UI*
