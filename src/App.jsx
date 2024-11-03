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
import RegisterUser from './pages/dashboards/AdminPages/RegisterUser';
import AdminPage2 from './pages/dashboards/AdminPages/SecondAdmin';
import DeleteUser from './pages/dashboards/AdminPages/DeleteUser';
import NoRole from './pages/NoRole';
import { checkAuthTokenAndFetchUser } from './utils/authUtils';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import ProtectedRoute from './HOCS/ProtectedRoute';
import AdminDefaultPage from './pages/dashboards/AdminPages/AdminDefaultPage';
import SearchUser from './pages/dashboards/AdminPages/SearchUser';
import ViewAndEditAccount from './pages/dashboards/AdminPages/ViewAndEditAccount';
import PasswordUpdate from './components/PasswordUpdate';
import AddStudentInternship from './pages/dashboards/DepartmentCoordinatorPages/AddStudentInternship';
import PostInternships from './pages/dashboards/HeadCoordinatorPages/PostInternships';
import ApplyInternships from './pages/dashboards/StudentPages/ApplyInternships';
import AssignInternships from './pages/dashboards/HeadCoordinatorPages/AssignInternships';
import SendCompanyRequest from './pages/dashboards/HeadCoordinatorPages/SendCompanyRequest';
import CompanyPostingPage from './pages/dashboards/CompanyPostingPage';
import CheckCompanyInternships from './pages/dashboards/HeadCoordinatorPages/CheckCompanyInternships';
import AdvisorDefaultPage from './pages/dashboards/AdvisorPages/AdvisorDefaultPage';
import HeadCoordinatorDefaultPage from './pages/dashboards/HeadCoordinatorPages/HeadCoordinatorDefaultPage';
import DepartmentCoordinatorDefaultPage from './pages/dashboards/DepartmentCoordinatorPages/DepartmentCoordinatorDefaultPage';
import StudentDefaultPage from './pages/dashboards/StudentPages/StudentDefaultPage';
import MatchStudentsToAdvisors from './pages/dashboards/DepartmentCoordinatorPages/MatchStudentsToAdvisors';
import NotifyStudentsAdvisors from './pages/dashboards/DepartmentCoordinatorPages/NotifyStudentsAdvisors';
import ViewAndNotifyStudents from './pages/dashboards/AdvisorPages/ViewAndNotifyStudents';
import FillBiodataForm from './pages/dashboards/StudentPages/FillBiodataForm';
import InternshipStatus from './pages/dashboards/StudentPages/InternshipStatus';
import ViewStudent from './components/departmentCoordinatorComponents/ViewStudent';

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
          <Route path="/companyPostingPage" element={<CompanyPostingPage />} />

          <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>}>
            <Route index element={<AdminDefaultPage />} />
            <Route path="registerUser" element={<RegisterUser />} />
            <Route path="searchUser" element={<SearchUser />} />
            <Route path="viewAndEditAccount" element={<ViewAndEditAccount />} />
            <Route path="adminPage2" element={<AdminPage2 />} />
            <Route path="deleteUser" element={<DeleteUser />} />
          </Route>

          <Route path="/student" element={<ProtectedRoute><StudentDashboard /></ProtectedRoute>}>
            <Route index element={<StudentDefaultPage />} />      
            <Route path="applyInternships" element={<ApplyInternships />} /> 
            <Route path="fillBiodataForm" element={<FillBiodataForm />} /> 
            <Route path="internshipStatus" element={<InternshipStatus />} />
          </Route>

          <Route path="/advisor" element={<ProtectedRoute><AdvisorDashboard /></ProtectedRoute>}>
            <Route index element={<AdvisorDefaultPage />} />
            <Route path="viewAndNotifyStudents" element={<ViewAndNotifyStudents />} />    
          </Route>

          <Route path="/head-coordinator" element={<ProtectedRoute><HeadCoordinator /></ProtectedRoute>}>
            <Route index element={<HeadCoordinatorDefaultPage />} />
            <Route path="postInternships" element={<PostInternships />} />
            <Route path="assignInternships" element={<AssignInternships />} />
            <Route path="sendCompanyRequest" element={<SendCompanyRequest />} />
            <Route path="checkCompanyInternships" element={<CheckCompanyInternships />} />
          </Route>

          <Route path="/department-coordinator" element={<ProtectedRoute><DepartmentCoordinator /></ProtectedRoute>}>
            <Route index element={<DepartmentCoordinatorDefaultPage />} />     
            <Route path="addStudentInternship" element={<AddStudentInternship />} />  
            <Route path="notifyStudentsAdvisors" element={<NotifyStudentsAdvisors />} />
            <Route path="matchStudentsToAdvisors" element={<MatchStudentsToAdvisors />} />
            <Route path="viewStudent" element={<ViewStudent />} />
          </Route>
          
          <Route path="/login-options" element={<ProtectedRoute><LoginOptions /></ProtectedRoute>} />
          <Route path="/no-role" element={<ProtectedRoute><NoRole /></ProtectedRoute>} />
          <Route path="/needs-password-update" element={<ProtectedRoute><PasswordUpdate /></ProtectedRoute>} />
        </Routes>
      </Layout>
  )
}

export default App;
