import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
const icons = {
    BadgeOutlinedIcon
};


// ==============================|| Setting MENU ITEMS ||============================== //

const company = {
    id: 'company',
    type: 'group',
    children: [
        {
            id: 'company',
            title: 'Companies',
            type: 'item',
            url: '/companies',
            icon: icons.BadgeOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default company;