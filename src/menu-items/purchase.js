// assets
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
const icons = {
    ShoppingCartOutlinedIcon
};

// ==============================|| Purchase MENU ITEMS ||============================== //

const purchase = {
    id: 'Purchase',
    type: 'group',
    children: [
        {
            id: 'purchase',
            title: 'Purchase',
            type: 'collapse',
            icon: icons.ShoppingCartOutlinedIcon,
            children: [
                {
                    id: 'add-purchase',
                    title: 'Add Purchase',
                    type: 'item',
                    url: '/purchase/add-purchase',
                    breadcrumbs: false
                },
                {
                    id: 'manage-purchase',
                    title: 'Manage Purchase',
                    type: 'item',
                    url: '/purchase/manage-purchase',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default purchase;
