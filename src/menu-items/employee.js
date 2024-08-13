// assets
import BadgeOutlinedIcon from '@mui/icons-material/BadgeOutlined';
const icons = {
    BadgeOutlinedIcon
};

// ==============================|| employee MENU ITEMS ||============================== //

const employee = {
    id: 'Employee',
    type: 'group',
    children: [
        {
            id: 'employee',
            title: 'Employee',
            type: 'collapse',
            icon: icons.BadgeOutlinedIcon,
            children: [
                {
                    id: 'add-employee',
                    title: 'Add Employee',
                    type: 'item',
                    url: '/employee/add-employee',
                    breadcrumbs: false
                },
                {
                    id: 'manage-employee',
                    title: 'Manage Employee',
                    type: 'item',
                    url: '/employee/manage-employee',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default employee;
