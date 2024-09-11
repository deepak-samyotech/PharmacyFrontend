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
import { admin } from 'store/constant';
import report from './SuperAdmin/report';
import company from './SuperAdmin/company';
// ==============================|| MENU ITEMS ||============================== //

let menuItems;
const AdminItems = {
  items: [dashboard, poses, MedicineNew, customer, Suppliers, purchase, inventory, Accounts, returns, reports, employee, helps, other]
};

const SuperAdminItems = {
  items: [dashboard, company, report]
};


const decode = decodeToken();
if (decode?.role === admin) {
  menuItems = AdminItems;
} else {
  menuItems = SuperAdminItems;
}


export default menuItems;
