// assets
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';

// constant
const icons = {
  HomeOutlinedIcon
};

// ==============================|| DASHBOARD MENU ITEMS ||============================== //

const dashboard = {
  title: 'Dashboard-Menu',
  type: 'group',
  children: [
    {
      id: 'default',
      title: 'Dashboard',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.HomeOutlinedIcon,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
