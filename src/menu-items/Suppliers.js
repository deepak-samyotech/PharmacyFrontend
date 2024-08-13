// assets
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
const icons = {
    HandshakeOutlinedIcon
};

// ==============================|| Suppliers MENU ITEMS ||============================== //

const Suppliers = {
    id: 'Supplier',
    type: 'group',
    children: [
        {
            id: 'supplier',
            title: 'Supplier',
            type: 'collapse',
            icon: icons.HandshakeOutlinedIcon,
            children: [
                {
                    id: 'add-supplier',
                    title: 'Add Supplier',
                    type: 'item',
                    url: '/supplier/add-supplier',
                    breadcrumbs: false
                },
                {
                    id: 'manage-supplier',
                    title: 'Manage Supplier',
                    type: 'item',
                    url: '/supplier/manage-supplier',
                    breadcrumbs: false
                },
                {
                    id: 'supplier-balance',
                    title: 'supplier Balance',
                    type: 'item',
                    url: '/supplier/supplier-balance',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default Suppliers;
