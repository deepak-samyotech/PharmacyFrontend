// assets
import MedicalServicesOutlinedIcon from '@mui/icons-material/MedicalServicesOutlined';// constant
const icons = {
    MedicalServicesOutlinedIcon
};

// ==============================|| screens MENU ITEMS ||============================== //

const MedicineNew = {
    id: 'Medicines',
    type: 'group',
    children: [
        {
            id: 'medicine',
            title: 'Medicine',
            type: 'collapse',
            icon: icons.MedicalServicesOutlinedIcon,
            children: [
                {
                    id: 'add-medicine',
                    title: 'Add Medicine',
                    type: 'item',
                    url: '/medicine/add-medicine',
                    breadcrumbs: false
                },
                {
                    id: 'manage-medicine',
                    title: 'Manage Medicine',
                    type: 'item',
                    url: '/medicine/manage-medicine',
                    breadcrumbs: false
                }
            ]
        }
    ],

};

export default MedicineNew;
