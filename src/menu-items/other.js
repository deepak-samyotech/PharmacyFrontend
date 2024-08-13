import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
const icons = {
    SettingsOutlinedIcon
};

// ==============================|| Setting MENU ITEMS ||============================== //

const other = {
    id: 'setting-file',
    type: 'group',
    children: [
        {
            id: 'setting-page',
            title: 'Setting',
            type: 'item',
            url: '/setting-page',
            icon: icons.SettingsOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default other;