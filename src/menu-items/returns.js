// assets
import AssignmentReturnOutlinedIcon from '@mui/icons-material/AssignmentReturnOutlined';
const icons = {
    AssignmentReturnOutlinedIcon
};

// ==============================|| RETURN MENU ITEMS ||============================== //

const returns = {
    id: 'Returns',
    type: 'group',
    children: [
        {
            id: 'return',
            title: 'Return',
            type: 'collapse',
            icon: icons.AssignmentReturnOutlinedIcon,
            children: [
                {
                    id: 'purchase-return',
                    title: 'Purchase Return',
                    type: 'item',
                    url: '/returns/purchase-return',
                    breadcrumbs: false
                },
                {
                    id: 'sale-return',
                    title: 'Sale Return',
                    type: 'item',
                    url: '/returns/sale-return',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default returns;
