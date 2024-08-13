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
// ==============================|| MENU ITEMS ||============================== //

const menuItems = {
  items: [dashboard, poses, MedicineNew, customer, Suppliers, purchase, inventory, Accounts, returns, reports, employee, helps, other]
};

export default menuItems;
