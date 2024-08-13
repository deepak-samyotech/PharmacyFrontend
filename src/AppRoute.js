// // src/routes/index.js
// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import useRoleBasedAccess from '../hooks/useRoleBasedAccess';

// // Import your route components
// import Home from '../views/Home';
// import ManagerSalesmanRoute from './routes/authRoute/index';
// import AdminRoute from './routes/index';
// import Login from './views/pages/authentication/auth-forms/AuthLogin';

// const AppRoute = () => {
//   const { hasAccess } = useRoleBasedAccess();

//   return (
//     <Routes>
//       <Route path="/login" element={<Login />} />
//       <Route
//         path="/manager-salesman-route"
//         element={hasAccess(['MANAGER', 'SALESMAN']) ? <ManagerSalesmanRoute /> : <Navigate to="/login" />}
//       />
//       <Route
//         path="/admin-route"
//         element={hasAccess(['ADMIN']) ? <AdminRoute /> : <Navigate to="/login" />}
//       />
//       <Route path="/" element={<Home />} />
//       {/* Add other routes as needed */}
//     </Routes>
//   );
// };

// export default AppRoute;
