// assets
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
const icons = {
    FactCheckOutlinedIcon
};

// ==============================|| Purchase MENU ITEMS ||============================== //

const inventory = {
    id: 'inventory',
    type: 'group',
    children: [
        {
            id: 'inventory',
            title: 'Inventory',
            type: 'collapse',
            icon: icons.FactCheckOutlinedIcon,
            children: [
                {
                    id: 'manage-stock',
                    title: 'Manage Stock',
                    type: 'item',
                    url: '/inventory/manage-stock',
                    breadcrumbs: false
                },
                {
                    id: 'short-stock',
                    title: 'Short Stock',
                    type: 'item',
                    url: '/inventory/short-stock',
                    breadcrumbs: false
                },
                {
                    id: 'out-of-stock',
                    title: 'Out Of Stock',
                    type: 'item',
                    url: '/inventory/out-of-stock',
                    breadcrumbs: false
                },
                {
                    id: 'soon-expiring',
                    title: 'Soon Expiring',
                    type: 'item',
                    url: '/inventory/soon-expiring',
                    breadcrumbs: false
                },
                {
                    id: 'expire-medicine',
                    title: 'Expire Medicine',
                    type: 'item',
                    url: '/inventory/expire-medicine',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default inventory;
