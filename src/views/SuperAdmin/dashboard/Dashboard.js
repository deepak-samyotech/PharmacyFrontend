import { Grid } from '@mui/material'
import React, { useEffect, useState } from 'react'
import TotalOrderLineChartCard from './TotalOrderLineChartCard'
import TotalSupplierCard from './TotalSupplierCard';
import TotalSalesCard from './TotalSalesCard';
import { gridSpacing } from 'store/constant';
import { fetchAdmins } from 'utils/api';

const Dashboard = () => {
    const [isLoading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [totalAdmin, setTotalAdmin] = useState(0);
    const [totalActiveAdmin, setTotalActiveAdmin] = useState(0);

    const fetchAdminData = async () => {
      try {
        // Fetch medicine data
        const responseAdmins = await fetchAdmins();
          setTotalAdmin(responseAdmins?.data?.users?.length);

          const activeUser = responseAdmins?.data?.users?.filter((user) => user?.active != false);
          setTotalActiveAdmin(activeUser?.length);
        
  
  
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(true);
      }
    };
  
    useEffect(() => {
      fetchAdminData();
    }, []);
    return (
        <>
            <Grid container spacing={gridSpacing}>
                <Grid item xs={12}>
                    <Grid container spacing={4}>
                        {/* Set lg={4} to divide the grid into 3 equal parts */}
                        <Grid item sm={6} xs={12} md={4} lg={4}>
                            <TotalOrderLineChartCard totalAdmin={totalAdmin } />
                        </Grid>
                        <Grid item sm={6} xs={12} md={4} lg={4}>
                            <TotalSupplierCard totalActiveAdmin={ totalActiveAdmin } />
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