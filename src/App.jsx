import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

function App() {

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/student" element={<StudentDashboard />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/login-options" element={<LoginOptions />} />
          <Route path="/advisor" element={<AdvisorDashboard />} />
          <Route path="/head-coordinator" element={<HeadCoordinator />} />
          <Route path="/department-coordinator" element={<DepartmentCoordinator />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App;
