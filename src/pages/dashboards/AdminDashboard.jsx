import { useState } from 'react';
import SidebarComp from '../../components/Sidebar';
import { Outlet } from 'react-router-dom';
import { FaUserCog } from "react-icons/fa";
import { FaRegistered } from "react-icons/fa";
import { HiOutlineUserRemove } from "react-icons/hi";
import { IconButton } from '@material-tailwind/react';
import { RxHamburgerMenu } from "react-icons/rx";




const AdminDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "Register User", itemLink: "registerUser", itemIcon: FaUserCog},
    {itemId: 2, itemTitle: "User Register", itemLink: "adminPage2", itemIcon: FaRegistered},
    {itemId: 3, itemTitle: "Delete User", itemLink: "deleteUser", itemIcon: HiOutlineUserRemove},
  ];



  return (
    <div className="md:flex w-full">
      <SidebarComp 
        className="bg-blue-700"
        collapsed={collapsed} setCollapsed={setCollapsed} 
        toggled={toggled} setToggled={setToggled}
        sidebarItems={sidebarItems}
      />
      <div className="h-[calc(100vh-9vh)] w-full overflow-auto scrollbar-hide">
        <Outlet />
      </div>
    </div>
  )
}

export default AdminDashboard;