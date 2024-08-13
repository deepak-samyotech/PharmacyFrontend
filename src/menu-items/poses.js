import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
const icons = {
    FactCheckOutlinedIcon
};

// ==============================|| POS MENU ITEMS ||============================== //

const other = {
    id: 'pos-file',
    type: 'group',
    children: [
        {
            id: 'pos-page',
            title: 'POS',
            type: 'item',
            url: '/pos-page',
            icon: icons.FactCheckOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default other;