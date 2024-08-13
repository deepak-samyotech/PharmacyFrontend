// assets
import PsychologyAltOutlinedIcon from '@mui/icons-material/PsychologyAltOutlined';
const icons = {
    PsychologyAltOutlinedIcon
};

// ==============================|| HELP MENU ITEMS ||============================== //

const helps = {
    id: 'Helps',
    type: 'group',
    children: [
        {
            id: 'help',
            title: 'Help',
            type: 'collapse',
            icon: icons.PsychologyAltOutlinedIcon,
            children: [
                {
                    id: 'phone-book',
                    title: 'Phone Book',
                    type: 'item',
                    url: '/help/phone-book',
                    breadcrumbs: false
                },
                {
                    id: 'doctor',
                    title: 'Doctor',
                    type: 'item',
                    url: '/help/doctor',
                    breadcrumbs: false
                },
                {
                    id: 'hospital',
                    title: 'Hospital',
                    type: 'item',
                    url: '/help/hospital',
                    breadcrumbs: false
                },
                {
                    id: 'ambulance',
                    title: 'Ambulance',
                    type: 'item',
                    url: '/help/ambulance',
                    breadcrumbs: false
                },
                {
                    id: 'fire-service',
                    title: 'Fire Service',
                    type: 'item',
                    url: '/help/fire-service',
                    breadcrumbs: false
                },
                {
                    id: 'police',
                    title: 'Police',
                    type: 'item',
                    url: '/help/police',
                    breadcrumbs: false
                }
            ]
        }
    ]
};

export default helps;
