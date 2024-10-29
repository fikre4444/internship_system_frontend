import { useState } from "react";
import SidebarComp from "../../components/Sidebar";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { FaSignsPost } from "react-icons/fa6";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";
import { Outlet } from "react-router-dom";

const HeadCoordinatorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "Post Internships", itemLink: "postInternships", itemIcon: FaSignsPost},
    {itemId: 2, itemTitle: "Assign Internships", itemLink: "assignInternships", itemIcon: FaUserCog},
    {itemId: 3, itemTitle: "Send Forms To Companies", itemLink: "sendCompanyRequest", itemIcon: VscGitPullRequestGoToChanges}
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