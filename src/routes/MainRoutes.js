import { lazy } from "react";
import PrivateRoute from './PrivateRoute';
// project imports
import MainLayout from "layout/MainLayout";
import Loadable from "ui-component/Loadable";
import ManageInvoice from "views/screens/invoice/ManageInvoice";

// dashboard routing
const DashboardDefault = Loadable(
  lazy(() => import("views/dashboard/Default"))
);

//Medicine routing
const AddMedicine = Loadable(
  lazy(() => import("views/screens/medicine/AddMedicine"))
);
const ManageMedicine = Loadable(
  lazy(() => import("views/screens/medicine/ManageMedicine"))
);
//customer routing
const AddCustomer = Loadable(
  lazy(() => import("views/screens/customer/AddCustomer"))
);
const ManageCustomer = Loadable(
  lazy(() => import("views/screens/customer/ManageCustomer"))
);
const RegularCustomer = Loadable(
  lazy(() => import("views/screens/customer/RegularCustomer"))
);
const WholesaleCustomer = Loadable(
  lazy(() => import("views/screens/customer/WholesaleCustomer"))
);
//supplier routing
const AddSupplier = Loadable(
  lazy(() => import("views/screens/supplier/AddSupplier"))
);
const ManageSupplier = Loadable(
  lazy(() => import("views/screens/supplier/ManageSupplier"))
);
const SupplierBalance = Loadable(
  lazy(() => import("views/screens/supplier/SupplierBalance"))
);
//supplier routing
const AddPurchase = Loadable(
  lazy(() => import("views/screens/purchase/AddPurchase"))
);
const ManagePurchase = Loadable(
  lazy(() => import("views/screens/purchase/ManagePurchase"))
);
// inventory routing
const ManageStock = Loadable(
  lazy(() => import("views/screens/inventory/ManageStock"))
);
const ShortStock = Loadable(
  lazy(() => import("views/screens/inventory/ShortStock"))
);
const OutOfStock = Loadable(
  lazy(() => import("views/screens/inventory/OutOfStock"))
);
const SoonExpiring = Loadable(
  lazy(() => import("views/screens/inventory/SoonExpiring"))
);
const ExpiredMedicine = Loadable(
  lazy(() => import("views/screens/inventory/ExpiredMedicine"))
);
// account routing
const CustomerBalance = Loadable(
  lazy(() => import("views/screens/Account/CustomerBalance"))
);
const SupplierBalances = Loadable(
  lazy(() => import("views/screens/Account/SupplierBalance"))
);
const Payment = Loadable(lazy(() => import("views/screens/Account/Payments")));
const Closing = Loadable(lazy(() => import("views/screens/Account/Closing")));
const ClosingReport = Loadable(
  lazy(() => import("views/screens/Account/ClosingReport"))
);
const ManageBank = Loadable(
  lazy(() => import("views/screens/Account/ManageBank"))
);
// RETURN routing
const PurchaseReturn = Loadable(
  lazy(() => import("views/screens/returns/PurchaseReturn"))
);
const SaleReturn = Loadable(
  lazy(() => import("views/screens/returns/SaleReturn"))
);
// Report routing
const TodayReport = Loadable(
  lazy(() => import("views/screens/reports/TodayReport"))
);
const SalesReport = Loadable(
  lazy(() => import("views/screens/reports/SalesReport"))
);
// const CounterReport = Loadable(lazy(() => import('views/screens/reports/CounterReport')));
const SalesReturnReport = Loadable(
  lazy(() => import("views/screens/reports/SalesReturnReport"))
);
const PurchaseReport = Loadable(
  lazy(() => import("views/screens/reports/PurchaseReport"))
);
const PurchaseReturnReport = Loadable(
  lazy(() => import("views/screens/reports/PurchaseReturnReport"))
);
//employee routing
const AddEmployee = Loadable(
  lazy(() => import("views/screens/Employees/AddEmployee"))
);
const ManageEmployee = Loadable(
  lazy(() => import("views/screens/Employees/ManageEmployee"))
);
//help routing
const PhoneBook = Loadable(lazy(() => import("views/screens/Help/PhoneBook")));
const Doctor = Loadable(lazy(() => import("views/screens/Help/Doctor")));
const Hospital = Loadable(lazy(() => import("views/screens/Help/Hospital")));
const Ambulance = Loadable(lazy(() => import("views/screens/Help/Ambulance")));
const FireService = Loadable(
  lazy(() => import("views/screens/Help/FireService"))
);
const Police = Loadable(lazy(() => import("views/screens/Help/Police")));
//setting routing
const Setting = Loadable(
  lazy(() => import("views/screens/settingPage/Setting"))
);
//Pos routing
const Pos = Loadable(lazy(() => import("views/screens/pos/Pos")));
//invoice
const Invoice = Loadable(
  lazy(() => import("views/screens/invoice/ManageInvoice"))
);

// ==============================|| MAIN ROUTING ||============================== //

const MainRoutes = {
  path: "/",
  element: <MainLayout />,
  children: [
    {
      path: "/",
      element: <PrivateRoute><DashboardDefault /></PrivateRoute>,
    },
    {
      path: "dashboard",
      children: [
        {
          path: "default",
          element: <PrivateRoute><DashboardDefault /></PrivateRoute>,
        },
      ],
    },
    // --------------------pos---------------------
    {
      path: "pos-page",
      element: <PrivateRoute><Pos /></PrivateRoute>,
    },
    // --------------------invoice---------------------
    {
      path: "/invoice/manage-invoice",
      element: <PrivateRoute><ManageInvoice /></PrivateRoute>,
    },
    // -------------------medicine-----------------
    {
      path: "medicine",
      children: [
        {
          path: "add-medicine",
          element: <PrivateRoute><AddMedicine /></PrivateRoute>,
        },
      ],
    },
    {
      path: "medicine",
      children: [
        {
          path: "manage-medicine",
          element: <PrivateRoute><ManageMedicine /></PrivateRoute>,
        },
      ],
    },
    // --------------------customer---------------------
    {
      path: "customer",
      children: [
        {
          path: "add-customer",
          element: <PrivateRoute><AddCustomer /></PrivateRoute>,
        },
      ],
    },
    {
      path: "customer",
      children: [
        {
          path: "manage-customer",
          element: <PrivateRoute><ManageCustomer /></PrivateRoute>,
        },
      ],
    },
    {
      path: "customer",
      children: [
        {
          path: "regular-customer",
          element: <PrivateRoute><RegularCustomer /></PrivateRoute>,
        },
      ],
    },
    {
      path: "customer",
      children: [
        {
          path: "wholesale-customer",
          element: <PrivateRoute><WholesaleCustomer /></PrivateRoute>,
        },
      ],
    },
    // --------------------Supplier---------------------
    {
      path: "supplier",
      children: [
        {
          path: "add-supplier",
          element: <PrivateRoute><AddSupplier /></PrivateRoute>,
        },
      ],
    },
    {
      path: "supplier",
      children: [
        {
          path: "manage-supplier",
          element: <PrivateRoute><ManageSupplier /></PrivateRoute>,
        },
      ],
    },
    {
      path: "supplier",
      children: [
        {
          path: "supplier-balance",
          element: <PrivateRoute><SupplierBalance /></PrivateRoute>,
        },
      ],
    },
    // --------------------purchase---------------------
    {
      path: "purchase",
      children: [
        {
          path: "add-purchase",
          element: <PrivateRoute><AddPurchase /></PrivateRoute>,
        },
      ],
    },
    {
      path: "purchase",
      children: [
        {
          path: "manage-purchase",
          element: <PrivateRoute><ManagePurchase /></PrivateRoute>,
        },
      ],
    },
    //------------------inventory-----------------
    {
      path: "inventory",
      children: [
        {
          path: "manage-stock",
          element: <PrivateRoute><ManageStock /></PrivateRoute>,
        },
      ],
    },
    {
      path: "inventory",
      children: [
        {
          path: "short-stock",
          element: <PrivateRoute><ShortStock /></PrivateRoute>,
        },
      ],
    },
    {
      path: "inventory",
      children: [
        {
          path: "out-of-stock",
          element: <PrivateRoute><OutOfStock /></PrivateRoute>,
        },
      ],
    },
    {
      path: "inventory",
      children: [
        {
          path: "soon-expiring",
          element: <PrivateRoute><SoonExpiring /></PrivateRoute>,
        },
      ],
    },
    {
      path: "inventory",
      children: [
        {
          path: "expire-medicine",
          element: <PrivateRoute><ExpiredMedicine /></PrivateRoute>,
        },
      ],
    },

    //------------------Account-----------------
    {
      path: "account",
      children: [
        {
          path: "customer-balance",
          element: <PrivateRoute><CustomerBalance /></PrivateRoute>,
        },
      ],
    },
    {
      path: "account",
      children: [
        {
          path: "supplier-balance",
          element: <PrivateRoute><SupplierBalances /></PrivateRoute>,
        },
      ],
    },
    {
      path: "account",
      children: [
        {
          path: "payment",
          element:<PrivateRoute> <Payment /></PrivateRoute>,
        },
      ],
    },
    {
      path: "account",
      children: [
        {
          path: "closing",
          element: <PrivateRoute><Closing /></PrivateRoute>,
        },
      ],
    },
    {
      path: "account",
      children: [
        {
          path: "closing-report",
          element: <PrivateRoute><ClosingReport /></PrivateRoute>,
        },
      ],
    },
    {
      path: "account",
      children: [
        {
          path: "manage-bank",
          element: <PrivateRoute><ManageBank /></PrivateRoute>,
        },
      ],
    },
    // --------------------RETURN---------------------
    {
      path: "Returns",
      children: [
        {
          path: "purchase-return",
          element: <PrivateRoute><PurchaseReturn /></PrivateRoute>,
        },
      ],
    },
    {
      path: "Returns",
      children: [
        {
          path: "sale-return",
          element: <PrivateRoute><SaleReturn /></PrivateRoute>,
        },
      ],
    },
    // --------------------REPORTS---------------------
    {
      path: "report",
      children: [
        {
          path: "today-report",
          element: <PrivateRoute><TodayReport /></PrivateRoute>,
        },
      ],
    },
    {
      path: "report",
      children: [
        {
          path: "sales-report",
          element: <PrivateRoute><SalesReport /></PrivateRoute>,
        },
      ],
    },
    // {
    //   path: 'report',
    //   children: [
    //     {
    //       path: 'counter-report',
    //       element: <CounterReport />
    //     }
    //   ]
    // },
    {
      path: "report",
      children: [
        {
          path: "sales-return-report",
          element: <PrivateRoute><SalesReturnReport /></PrivateRoute>,
        },
      ],
    },
    {
      path: "report",
      children: [
        {
          path: "purchase-report",
          element: <PrivateRoute><PurchaseReport /></PrivateRoute>,
        },
      ],
    },
    {
      path: "report",
      children: [
        {
          path: "purchase-return-report",
          element: <PrivateRoute><PurchaseReturnReport /></PrivateRoute>,
        },
      ],
    },
    // --------------------employee---------------------
    {
      path: "employee",
      children: [
        {
          path: "add-employee",
          element: <PrivateRoute><AddEmployee /></PrivateRoute>,
        },
      ],
    },
    {
      path: "employee",
      children: [
        {
          path: "manage-employee",
          element: <PrivateRoute><ManageEmployee /></PrivateRoute>,
        },
      ],
    },
    // --------------------help---------------------
    {
      path: "help",
      children: [
        {
          path: "phone-book",
          element: <PrivateRoute><PhoneBook /></PrivateRoute>,
        },
      ],
    },
    {
      path: "help",
      children: [
        {
          path: "doctor",
          element: <PrivateRoute><Doctor /></PrivateRoute>,
        },
      ],
    },
    {
      path: "help",
      children: [
        {
          path: "hospital",
          element: <PrivateRoute><Hospital /></PrivateRoute>,
        },
      ],
    },
    {
      path: "help",
      children: [
        {
          path: "ambulance",
          element: <PrivateRoute><Ambulance /></PrivateRoute>,
        },
      ],
    },
    {
      path: "help",
      children: [
        {
          path: "fire-service",
          element:<PrivateRoute> <FireService /></PrivateRoute>,
        },
      ],
    },
    {
      path: "help",
      children: [
        {
          path: "police",
          element: <PrivateRoute><Police /></PrivateRoute>,
        },
      ],
    },
    // --------------------setting---------------------
    {
      path: "setting-page",
      element: <PrivateRoute><Setting /></PrivateRoute>,
    },
   
  ],
};

export default MainRoutes;
