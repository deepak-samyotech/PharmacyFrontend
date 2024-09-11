import { Grid } from '@mui/material'
import React, { useState } from 'react'
import TotalOrderLineChartCard from './TotalOrderLineChartCard'
import TotalSupplierCard from './TotalSupplierCard';
import TotalSalesCard from './TotalSalesCard';
import { gridSpacing } from 'store/constant';

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={4}>
                        {/* Set lg={4} to divide the grid into 3 equal parts */}
                        <Grid item sm={6} xs={12} md={4} lg={4}>
                            <TotalOrderLineChartCard />
                        </Grid>
                        <Grid item sm={6} xs={12} md={4} lg={4}>
                            <TotalSupplierCard />
                        </Grid>
                        <Grid item sm={6} xs={12} md={4} lg={4}>
                            <TotalSalesCard />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    )
}

export default Dashboard;