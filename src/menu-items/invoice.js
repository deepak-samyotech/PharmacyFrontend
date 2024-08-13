// ==============================|| Account MENU ITEMS ||============================== //

const Invoice = {
            id: 'invoice',
            title: 'Invoice',
            children: [
                {
                    id: 'manage-invoice',
                    title: 'Manage Invoice',
                    type: 'item',
                    url: '/invoice/manage-invoice',
                    breadcrumbs: false
                },
            ]
        };

export default Invoice;
