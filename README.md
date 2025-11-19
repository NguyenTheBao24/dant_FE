# Boarding House Management System

A comprehensive web application for managing boarding houses (hostels/dormitories) with separate dashboards for administrators, managers, and tenants. Built with React, Vite, and Supabase.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [User Roles](#user-roles)
- [Key Features by Role](#key-features-by-role)
- [Available Scripts](#available-scripts)
- [Building for Production](#building-for-production)

## 🎯 Overview

This is a modern boarding house management system designed to streamline operations for property administrators, building managers, and tenants. The system provides:

- **Public-facing landing page** showcasing boarding house facilities
- **Admin dashboard** for managing multiple properties, managers, and tenants
- **Manager dashboard** for day-to-day operations of assigned buildings
- **Tenant dashboard** for viewing contracts, invoices, and personal information

## ✨ Features

### Public Features

- Beautiful landing page with boarding house showcase
- Room details with image galleries
- Amenities section
- Contact form for inquiries
- Building selection

### Admin Features

- Multi-property management
- Create and manage buildings (tòa nhà)
- Assign managers to buildings
- View and manage tenants across all properties
- Track occupancy rates
- Expense management
- Notification system
- Analytics and reporting

### Manager Features

- Manage assigned building(s)
- Room management (view, update room status)
- Tenant management (add, edit, remove tenants)
- Contract management
- Invoice tracking
- Notification handling
- Overview dashboard with statistics

### Tenant Features

- Overview dashboard with statistics
- View and manage contracts (active and expired)
- View invoice summaries and payment history
- View and handle notifications
- Update personal profile information

## 🛠 Tech Stack

### Frontend

- **React 19** - UI library
- **Vite 7** - Build tool and dev server
- **React Router DOM 7** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
  - Radix Avatar
  - Radix Dialog
  - Radix Dropdown Menu
  - Radix Select
  - Radix Slot
  - Radix Label
- **Shadcn UI** - UI component library (based on Radix)
- **Lucide React** - Icon library
- **Heroicons** - Additional icons
- **Font Awesome** - Icon library
- **Recharts** - Chart library for data visualization
- **html2canvas** & **jsPDF** - PDF generation
- **TypeScript** - Type safety (partial migration)

### Backend & Services

- **Supabase** - Backend as a Service (database, authentication)
- **Custom API Service** - RESTful API wrapper with JWT token handling

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 📁 Project Structure

```
dant_FE/
├── public/                 # Static assets
│   ├── images/            # Image assets
│   └── vite.svg
├── src/
│   ├── assets/            # Application assets (images, logos)
│   ├── components/        # React components
│   │   ├── admin/         # Admin dashboard components
│   │   │   ├── dashboard/ # Admin dashboard UI
│   │   │   ├── pages/     # Admin page components
│   │   │   └── ui/        # Admin UI components
│   │   ├── boardingHouse/  # Public landing page components
│   │   ├── employ/        # Tenant dashboard components
│   │   ├── forms/         # Reusable form components
│   │   ├── layout/        # Layout components (Header, Footer)
│   │   ├── manager/       # Manager dashboard components
│   │   ├── shared/        # Shared components
│   │   └── ui/            # General UI components
│   ├── constants/         # Application constants
│   │   ├── endpoints-constant.js
│   │   └── routes-constant.jsx
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utility libraries
│   ├── pages/             # Page components
│   │   ├── admin/         # Admin pages
│   │   ├── boardingHouse/ # Landing page
│   │   ├── employ/        # Tenant pages
│   │   ├── login/         # Login page
│   │   └── manager/       # Manager pages
│   ├── services/          # API service layer
│   │   ├── api-service.js          # Main API client
│   │   ├── supabase-client.js      # Supabase client
│   │   ├── bang-gia.service.js     # Pricing service
│   │   ├── can-ho.service.js       # Apartment/Room service
│   │   ├── chi-tieu.service.js     # Expense service
│   │   ├── hoa-don.service.js      # Invoice service
│   │   ├── hop-dong.service.js     # Contract service
│   │   ├── khach-thue.service.js   # Tenant service
│   │   ├── quan-ly.service.js      # Manager service
│   │   ├── tai-khoan.service.js    # Account service
│   │   ├── thong-bao.service.js    # Notification service
│   │   ├── toa-nha.service.js      # Building service
│   │   └── ... (other services)
│   ├── types/             # TypeScript type definitions
│   ├── utils/             # Utility functions
│   ├── App.jsx            # Root component
│   ├── main.jsx           # Application entry point
│   └── index.css          # Global styles
├── supabase/
│   └── functions/         # Supabase Edge Functions
│       ├── send-contract-email/
│       └── send-notification-email/
├── package.json
├── vite.config.js
├── tailwind.config.js
└── tsconfig.json
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **npm** or **yarn**
- **Supabase account** and project

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd dant_FE
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**
   Create a `.env` file in the root directory (see [Environment Variables](#environment-variables) section)

4. **Start the development server**

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal)

## 🔐 Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# API Configuration
VITE_API_BASE_URL=your_api_base_url
```

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create a new project or select an existing one
3. Navigate to **Settings** → **API**
4. Copy the **Project URL** (`VITE_SUPABASE_URL`)
5. Copy the **anon public** key (`VITE_SUPABASE_ANON_KEY`)

## 👥 User Roles

The system supports three main user roles:

### 1. Admin (`admin`)

- Full system access
- Can manage all properties, managers, and tenants
- Access to analytics and reporting
- Can create and delete buildings
- Can assign managers to buildings

### 2. Manager (`quan_ly`)

- Manages assigned building(s)
- Can view and manage rooms
- Can add, edit, and remove tenants
- Can create and manage contracts
- Can view invoices and notifications
- Limited to their assigned building(s)

### 3. Tenant (`khach_thue`)

- View personal information
- View active contracts
- View invoice summaries
- Update personal details
- Limited to their own data

## 🎨 Key Features by Role

### Admin Dashboard (`/admin/dashboard`)

- **Overview Page**: Statistics, charts, and quick insights
- **Customers Tab**: Manage tenants across all properties
- **Contact Page**: Manage building managers
- **Expenses Page**: Track and manage expenses
- **Notifications Page**: View and handle notifications
- **Add Hostel Page**: Create new buildings with room configuration

### Manager Dashboard (`/manager`)

- **Overview Page**: Building statistics, room occupancy, key metrics, revenue data
- **Tenants Page**: Add, edit, and remove tenants for assigned building
- **Rooms Page**: View and manage room status and availability
- **Notifications Page**: Handle tenant notifications, inquiries, and announcements

### Tenant Dashboard (`/employ`)

- **Overview Page**: Personal dashboard with statistics and active contract information
- **Contracts Page**: View active and past contracts
- **Invoices Page**: View invoice summaries and payment history
- **Notifications Page**: View and manage notifications
- **Profile Page**: Update personal information

### Public Landing Page (`/`)

- **Hero Section**: Main showcase with call-to-action
- **Room Details**: Display different room types with galleries
- **Amenities Section**: Showcase building facilities
- **Contact Form**: Inquiry form for potential tenants
- **Building Selection**: Allow visitors to select specific buildings

## 📜 Available Scripts

### Development

```bash
npm run dev
```

Starts the development server with hot module replacement (HMR)

### Build

```bash
npm run build
```

Creates an optimized production build in the `dist` directory

### Preview

```bash
npm run preview
```

Preview the production build locally

### Lint

```bash
npm run lint
```

Run ESLint to check code quality

## 🏗 Building for Production

1. **Build the application**

```bash
npm run build
```

2. **Preview the build**

```bash
npm run preview
```

3. **Deploy**
   The `dist` directory contains the production-ready files that can be deployed to any static hosting service:

- **Vercel**: Connect your GitHub repo or deploy with `vercel`
- **Netlify**: Drag and drop the `dist` folder or connect via Git
- **GitHub Pages**: Upload the `dist` folder contents
- **Any static hosting**: Upload contents of `dist` directory

## 🔧 Configuration

### Vite Configuration

The project uses Vite with React plugin. Path aliases are configured:

- `@/` maps to `./src/`

### Tailwind Configuration

Tailwind CSS 4 is configured with default theme extensions. Customize in `tailwind.config.js`

### Routing

Routes are defined in `src/constants/routes-constant.jsx` with lazy loading for better performance.

## 📦 Key Services

The application uses a service-oriented architecture:

- **api-service.js**: Main HTTP client with JWT token management
- **supabase-client.js**: Supabase database client
- **tai-khoan.service.js**: User account management
- **toa-nha.service.js**: Building management
- **can-ho.service.js**: Room/apartment management
- **khach-thue.service.js**: Tenant management
- **hop-dong.service.js**: Contract management
- **hoa-don.service.js**: Invoice management
- **quan-ly.service.js**: Manager management
- **thong-bao.service.js**: Notification system
- **email.service.js**: Email functionality

## 🎯 Database Schema Overview

The application uses Supabase (PostgreSQL) with the following main entities:

- **tai_khoan**: User accounts (authentication)
- **toa_nha**: Buildings
- **can_ho**: Apartments/Rooms
- **quan_ly**: Managers
- **khach_thue**: Tenants
- **hop_dong**: Contracts
- **hoa_don**: Invoices
- **thong_bao**: Notifications
- **chi_tieu**: Expenses
- **bang_gia**: Pricing

## 🤝 Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## 📝 Notes

- The application uses a mix of JavaScript and TypeScript (gradual migration)
- Session storage is used for authentication state
- JWT tokens are stored in local storage via `localStorageService`
- The project follows modern React patterns with functional components and hooks
- Supabase provides real-time capabilities for notifications and updates

## 📄 License

[Add your license information here]

## 👨‍💻 Development

For development guidelines, please refer to the workspace rules and coding standards defined in the project configuration files.

---

**Built with ❤️ using React, Vite, and Supabase**
