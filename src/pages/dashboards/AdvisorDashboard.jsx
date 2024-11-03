import { useState } from "react";
import SidebarComp from "../../components/Sidebar";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { Outlet } from "react-router-dom";
import { FaStreetView } from "react-icons/fa6";

const AdvisorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "View & Notify Students", itemLink: "viewAndNotifyStudents", itemIcon: IoIosNotifications},
  ];

  return (
    <div className="md:flex w-full">
      <SidebarComp 
        className="bg-blue-500"
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

export default AdvisorDashboard;


