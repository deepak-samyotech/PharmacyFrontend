// assets
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';// constant
const icons = {
    GroupsOutlinedIcon
};

// ==============================|| CUSTOMER MENU ITEMS ||============================== //

const customer = {
    id: 'Customers',
    type: 'group',
    children: [
        {
            id: 'customer',
            title: 'Customer',
            type: 'collapse',
            icon: icons.GroupsOutlinedIcon,
            children: [
                {
                    id: 'add-customer',
                    title: 'Add Customer',
                    type: 'item',
                    url: '/customer/add-customer',
                    breadcrumbs: false
                },
                {
                    id: 'manage-customer',
                    title: 'Manage Customer',
                    type: 'item',
                    url: '/customer/manage-customer',
                    breadcrumbs: false
                },
                {
                    id: 'regular-customer',
                    title: 'Regular Customer',
                    type: 'item',
                    url: '/customer/regular-customer',
                    breadcrumbs: false
                },
                {
                    id: 'wholesale-customer',
                    title: 'Wholesale Customer',
                    type: 'item',
                    url: '/customer/wholesale-customer',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default customer;
