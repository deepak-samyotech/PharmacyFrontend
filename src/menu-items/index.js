import Accounts from './account';
import customer from './customer';
import dashboard from './dashboard';
import employee from './employee';
import helps from './help';
import inventory from './inventory';
import MedicineNew from './MedicineNew';
import other from './other';
import purchase from './purchase';
import reports from './report';
import poses from './poses';
import returns from './returns';
import Suppliers from './Suppliers';
import { decodeToken } from 'utils/jwtdecode';
import { admin, superAdmin } from 'store/constant';
import report from './SuperAdmin/report';
import company from './SuperAdmin/company';
// ==============================|| MENU ITEMS ||============================== //

let menuItems;
const AdminItems = {
  items: [dashboard, poses, MedicineNew, customer, Suppliers, purchase, inventory, Accounts, returns, reports, employee, helps]
};

const SuperAdminItems = {
  items: [dashboard, company]
};

const EmployeeItems = {
  items: [poses, MedicineNew, customer, Suppliers, inventory, returns, helps]
};

const decode = decodeToken();

if (decode?.role === superAdmin) {
  menuItems = SuperAdminItems;
}
else if (decode?.role === admin) {
  menuItems = AdminItems;
} else {
  console.log("employee routes--------");
  menuItems = EmployeeItems;
}


export default menuItems;
