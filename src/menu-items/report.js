// assets
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
const icons = {
    AssessmentOutlinedIcon
};

// ==============================|| Suppliers MENU ITEMS ||============================== //

const reports = {
    id: 'Report',
    type: 'group',
    children: [
        {
            id: 'report',
            title: 'Report',
            type: 'collapse',
            icon: icons.AssessmentOutlinedIcon,
            children: [
                {
                    id: 'today-report',
                    title: "Today's Report",
                    type: 'item',
                    url: '/report/today-report',
                    breadcrumbs: false
                },
                {
                    id: 'sales-report',
                    title: 'Sales Report',
                    type: 'item',
                    url: '/report/sales-report',
                    breadcrumbs: false
                },
                // {
                //     id: 'counter-report',
                //     title: "Counter Report",
                //     type: 'item',
                //     url: '/report/counter-report',
                //     breadcrumbs: false
                // },
                {
                    id: 'sales-return-report',
                    title: 'Sales Return Report',
                    type: 'item',
                    url: '/report/sales-return-report',
                    breadcrumbs: false
                },
                {
                    id: 'purchase-report',
                    title: "Purchase Report",
                    type: 'item',
                    url: '/report/purchase-report',
                    breadcrumbs: false
                },
                {
                    id: 'purchase-return-report',
                    title: "Purchase Return Report",
                    type: 'item',
                    url: '/report/purchase-return-report',
                    breadcrumbs: false
                },
            ]
        }
    ]
};

export default reports;
