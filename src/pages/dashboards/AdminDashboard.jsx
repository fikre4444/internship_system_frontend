import { useState } from 'react';
import SidebarComp from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { FaUserCog } from "react-icons/fa";
import { FaRegistered } from "react-icons/fa";


const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "Register User", itemLink: "registerUser", itemIcon: FaUserCog},
    {itemId: 2, itemTitle: "User Register", itemLink: "adminPage2", itemIcon: FaRegistered},
  ];



  return (
    <div className="flex w-full">
      <SidebarComp 
        className="bg-blue-500"
        collapsed={collapsed} setCollapsed={setCollapsed} 
        toggled={toggled} setToggled={setToggled}
        sidebarItems={sidebarItems}
      />
      <div className="h-[calc(100vh-9vh)] w-full overflow-auto scrollbar-hide">
        <button className="block md:hidden" onClick={() => setToggled(!toggled)}>
          toggle
        </button>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard;