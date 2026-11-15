import React, { lazy } from "react";

const PAGE_COMPONENTS = {
  globalSplash: {
    component: lazy(() => import("../pages/auth/SplashPage")),
    isProtected: false,
  },
  authLogin: {
    component: lazy(() => import("../pages/auth/LoginPage")),
    isProtected: false,
  },
  dashboard: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  membersPage: {
    component: lazy(() => import("../pages/anggota/MembersPage")),
    isProtected: true,
  },
  simpananDashboard: {
    component: lazy(() => import("../pages/simpanan/SimpananDashboard")),
    isProtected: true,
  },
  simpananReportPage: {
    component: lazy(() => import("../pages/simpanan/SimpananReportPage")),
    isProtected: true,
  },
  jualBeliDashboard: {
    component: lazy(() => import("../pages/jualBeli/JualBeliDashboard")),
    isProtected: true,
  },
  jualBeliReportPage: {
    component: lazy(() => import("../pages/jualBeli/JualBeliReport")),
    isProtected: true,
  },
  jualBeliReport: {
    component: lazy(() => import("../pages/jualBeli/JualBeliReport")),
    isProtected: true,
  },
  akadConfigPage: {
    component: lazy(() => import("../pages/konfigurasi/AkadConfigPage")),
    isProtected: true,
  },
  simpananConfigPage: {
    component: lazy(() => import("../pages/konfigurasi/SimpananConfigPage")),
    isProtected: true,
  },
  paymentFeeConfigPage: {
    component: lazy(() => import("../pages/konfigurasi/PaymentFeeConfigPage")),
    isProtected: true,
  },
  pinjamanList: {
    component: lazy(() => import("../pages/program/pinjaman/PinjamanList")),
    isProtected: true,
  },
  pinjamanReport: {
    component: lazy(() => import("../pages/program/pinjaman/PinjamanReport")),
    isProtected: true,
  },
  pinjamanInputModal: {
    component: lazy(() => import("../pages/program/pinjaman/PinjamanInputModal")),
    isProtected: true,
  },
  arisanBatchPage: {
    component: lazy(() => import("../pages/program/arisan/ArisanBatchPage")),
    isProtected: true,
  },
  arisanReport: {
    component: lazy(() => import("../pages/program/arisan/ArisanReport")),
    isProtected: true,
  },
  tabunganList: {
    component: lazy(() => import("../pages/tabungan/TabunganPage")),
    isProtected: true,
  },
  tabunganReport: {
    component: lazy(() => import("../pages/tabungan/TabunganReportPage")),
    isProtected: true,
  },
  investasiHalalList: {
    component: lazy(() =>
      import("../pages/investasi/halal/InvestasiHalalListPage")
    ),
    isProtected: true,
  },
  investasiHalalReport: {
    component: lazy(() =>
      import("../pages/investasi/halal/InvestasiReportPage")
    ),
    isProtected: true,
  },
  pendanaanSyariahList: {
    component: lazy(() =>
      import("../pages/investasi/pendanaan/PendanaanSyariahListPage")
    ),
    isProtected: true,
  },
  pendanaanSyariahReport: {
    component: lazy(() =>
      import("../pages/investasi/pendanaan/PendanaanSyariahReportPage")
    ),
    isProtected: true,
  },
  trainingPage: {
    component: lazy(() => import("../pages/training/TrainingPage")),
    isProtected: true,
  },
  reportsPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  settingsPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  accountPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  registrationsPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  billingPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
  transactionsPage: {
    component: lazy(() => import("../pages/dashboard/Dashboard")),
    isProtected: true,
  },
};

export default PAGE_COMPONENTS;
