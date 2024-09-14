import Header from "../components/Header"
import Footer from "../components/Footer"

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      { children }
      <Footer />
    </div>
  )
}

export default Layout;
