import Header from "../components/Header"
import Footer from "../components/Footer"
import { ToastContainer } from "react-toastify"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <ToastContainer />
      <Header />
      { children }
      <Footer />
    </div>
  )
}

export default Layout;
