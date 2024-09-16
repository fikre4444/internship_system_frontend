import { Outlet } from "react-router-dom";
import SidebarComp from "../../components/Sidebar";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { useState } from "react";

const StudentDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "First Student page", itemLink: "studentPage1", itemIcon: FaUserCog},
    {itemId: 2, itemTitle: "Second Student page", itemLink: "studentPage2", itemIcon: FaRegistered},
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

export default StudentDashboard;