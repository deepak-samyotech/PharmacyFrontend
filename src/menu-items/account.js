// assets
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
const icons = {
    AccountBalanceWalletOutlinedIcon
};

// ==============================|| Account MENU ITEMS ||============================== //

const Accounts = {
    id: 'Account',
    type: 'group',
    children: [
        {
            id: 'account',
            title: 'Account',
            type: 'collapse',
            icon: icons.AccountBalanceWalletOutlinedIcon,
            children: [
                {
                    id: 'customer-balance',
                    title: 'Customer Balance',
                    type: 'item',
                    url: '/account/customer-balance',
                    breadcrumbs: false
                },
                {
                    id: 'supplier-balance',
                    title: 'Supplier Balance',
                    type: 'item',
                    url: '/account/supplier-balance',
                    breadcrumbs: false
                },
                {
                    id: 'payment',
                    title: 'Payment',
                    type: 'item',
                    url: '/account/payment',
                    breadcrumbs: false
                },
                {
                    id: 'closing',
                    title: 'Closing',
                    type: 'item',
                    url: '/account/closing',
                    breadcrumbs: false
                },
                {
                    id: 'closing-report',
                    title: 'Closing Report',
                    type: 'item',
                    url: '/account/closing-report',
                    breadcrumbs: false
                },
                {
                    id: 'manage-bank',
                    title: 'Manage Bank',
                    type: 'item',
                    url: '/account/manage-bank',
                    breadcrumbs: false
                },
            ]
        }
    ]
};

export default Accounts;
