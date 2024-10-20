import './App.css'
import { useLocation, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import StudentDashboard from './pages/dashboards/StudentDashboard';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import AdvisorDashboard from './pages/dashboards/AdvisorDashboard';
import HeadCoordinator from './pages/dashboards/HeadCoordinatorDashboard';
import DepartmentCoordinator from './pages/dashboards/DepartmentCoordinatorDashboard';
import Homepage from './pages/Homepage';
import LoginOptions from './pages/LoginOptions';
import ResetPassword from './pages/ResetPassword';
import ForgotPassword from './pages/ForgotPassword';
import NotFound from './pages/NotFound';
import About from './pages/About';
import Contact from './pages/Contact';
import Layout from './HOCS/Layout';
import StudentPage1 from './pages/dashboards/StudentPages/StudentPage1';
import StudentPage2 from './pages/dashboards/StudentPages/StudentPage2';
import StudentPage3 from './pages/dashboards/StudentPages/StudentPage3';
import AdvisorPage1 from './pages/dashboards/AdvisorPages/AdvisorPage1';
import AdvisorPage2 from './pages/dashboards/AdvisorPages/AdvisorPage2';
import AdvisorPage3 from './pages/dashboards/AdvisorPages/AdvisorPage3';
import HeadCoordinatorPage1 from './pages/dashboards/HeadCoordinatorPages/HeadCoordinatorPage1';
import HeadCoordinatorPage2 from './pages/dashboards/HeadCoordinatorPages/HeadCoordinatorPage2';
import HeadCoordinatorPage3 from './pages/dashboards/HeadCoordinatorPages/HeadCoordinatorPage3';
import DepartmentCoordinatorPage1 from './pages/dashboards/DepartmentCoordinatorPages/DepartmentCoordinatorPage1';
import DepartmentCoordinatorPage3 from './pages/dashboards/DepartmentCoordinatorPages/DepartmentCoordinatorPage3';
import DepartmentCoordinatorPage2 from './pages/dashboards/DepartmentCoordinatorPages/DepartmentCoordinatorPage2';
import RegisterUser from './pages/dashboards/AdminPages/RegisterUser';
import AdminPage2 from './pages/dashboards/AdminPages/SecondAdmin';
import DeleteUser from './pages/dashboards/AdminPages/DeleteUser';
import NoRole from './pages/NoRole';
import { checkAuthTokenAndFetchUser } from './utils/authUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProtectedRoute from './HOCS/ProtectedRoute';
import DashboardDefaultPage from './pages/DashboardDefaultPage';
import AdminDefaultPage from './pages/dashboards/AdminPages/AdminDefaultPage';
import SearchUser from './pages/dashboards/AdminPages/SearchUser';
import ViewAndEditAccount from './pages/dashboards/AdminPages/ViewAndEditAccount';
import PasswordUpdate from './components/PasswordUpdate';
import AddStudentInternship from './pages/dashboards/DepartmentCoordinatorPages/AddStudentInternship';

function App() {

  const isLoggedIn = useSelector(state => state.user.isLoggedIn);
  const defaultHome = useSelector(state => state.user.defaultHome);
  console.log("is logged in is", isLoggedIn)

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();



  useEffect(() => {
    checkAuthTokenAndFetchUser(dispatch, navigate, location);
  }, []);

  return (
      <Layout>
        <Routes>
          <Route path="/" element={!isLoggedIn ? <Homepage /> : <Navigate to={defaultHome} />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to={defaultHome} />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          
          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminDefaultPage />} />
            <Route path="registerUser" element={<RegisterUser />} />
            <Route path="searchUser" element={<SearchUser />} />
            <Route path="viewAndEditAccount" element={<ViewAndEditAccount />} />
            <Route path="adminPage2" element={<AdminPage2 />} />
            <Route path="deleteUser" element={<DeleteUser />} />
          </Route>
          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardDefaultPage />} />
            <Route path="studentPage1" element={<StudentPage1 />} />
            <Route path="studentPage2" element={<StudentPage2 />} />         
            <Route path="studentPage3" element={<StudentPage3 />} />  
          </Route>
          <Route path="/advisor" element={<ProtectedRoute><AdvisorDashboard /></ProtectedRoute>}>
            <Route index element={<DashboardDefaultPage />} />
            <Route path="advisorPage1" element={<AdvisorPage1 />} />
            <Route path="advisorPage2" element={<AdvisorPage2 />} />         
            <Route path="advisorPage3" element={<AdvisorPage3 />} />         
          </Route>
          <Route path="/head-coordinator" element={<ProtectedRoute><HeadCoordinator /></ProtectedRoute>}>
            <Route index element={<DashboardDefaultPage />} />
            <Route path="headCoordinatorPage1" element={<HeadCoordinatorPage1 />} />
            <Route path="headCoordinatorPage2" element={<HeadCoordinatorPage2 />} />         
            <Route path="headCoordinatorPage3" element={<HeadCoordinatorPage3 />} />  
          </Route>
          <Route path="/department-coordinator" element={<ProtectedRoute><DepartmentCoordinator /></ProtectedRoute>}>
            <Route index element={<DashboardDefaultPage />} />
            <Route path="departmentCoordinatorPage1" element={<DepartmentCoordinatorPage1 />} />
            <Route path="departmentCoordinatorPage2" element={<DepartmentCoordinatorPage2 />} />         
            <Route path="addStudentInternship" element={<AddStudentInternship />} />  
          </Route>
          <Route path="/login-options" element={<ProtectedRoute><LoginOptions /></ProtectedRoute>} />
          <Route path="/no-role" element={<ProtectedRoute><NoRole /></ProtectedRoute>} />
          <Route path="/needs-password-update" element={<ProtectedRoute><PasswordUpdate /></ProtectedRoute>} />
        </Routes>
      </Layout>
  )
}

export default App;
