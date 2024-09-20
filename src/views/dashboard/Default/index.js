import { useEffect, useState } from 'react';

// material-ui
import { Grid } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// project imports
import EarningCard from './EarningCard';
import TotalOrderLineChartCard from './TotalOrderLineChartCard';
import { gridSpacing } from 'store/constant';
//----------------------MedicineCard----------------------------- 
import MedicineCard from './MedicineCard'
import TotalSupplierCard from './TotalSupplierCard';
import TotalGrowthBarChart from './TotalGrowthBarChart';
import TotalSalesCard from './TotalSalesCard';
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
// ==============================|| DEFAULT DASHBOARD ||============================== //

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [isLoading, setLoading] = useState(true);

  return (
    <>
      <Grid container spacing={gridSpacing}>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <TotalOrderLineChartCard />
            </Grid>
            <Grid item lg={3} md={6} sm={6} xs={12}>
              <EarningCard/>
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <TotalSupplierCard />
            </Grid>
            <Grid item sm={6} xs={12} md={6} lg={3}>
              <TotalSalesCard/>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
            <Grid item xs={12} md={12}>
              <TotalGrowthBarChart isLoading={isLoading} />
            </Grid>
          </Grid>
        </Grid>
        {/* //------------------------medicine---cards ------------------ */}
        <Grid item xs={12}>
          <MedicineCard />
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={gridSpacing}>
          </Grid>
        </Grid>
      </Grid>
    </>

  );
};

export default Dashboard;