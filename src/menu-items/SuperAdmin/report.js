import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
const icons = {
    AssessmentOutlinedIcon
};

// ==============================|| Setting MENU ITEMS ||============================== //

const report = {
    id: 'report',
    type: 'group',
    children: [
        {
            id: 'report-page',
            title: 'Report',
            type: 'item',
            url: '/report',
            icon: icons.AssessmentOutlinedIcon,
            breadcrumbs: false
        }
    ]
};

export default report;