import { useState } from "react";
import SidebarComp from "../../components/Sidebar";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";

import { Outlet } from "react-router-dom";

const HeadCoordinatorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "First head Coodinator page", itemLink: "headCoordinatorPage1", itemIcon: FaUserCog},
    {itemId: 2, itemTitle: "Second head Coodinator page", itemLink: "headCoordinatorPage2", itemIcon: FaRegistered},
    {itemId: 3, itemTitle: "Post Internships", itemLink: "postInternships", itemIcon: FaSignsPost}
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

export default HeadCoordinatorDashboard;