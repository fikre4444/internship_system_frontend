import { Outlet } from "react-router-dom";
import SidebarComp from "../../components/Sidebar";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { useState } from "react";
import { VscGitStashApply } from "react-icons/vsc";
import { FaTableCells, FaTachographDigital } from "react-icons/fa6";

const StudentDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "Internship Status", itemLink: "internshipStatus", itemIcon: FaTachographDigital},
    {itemId: 2, itemTitle: "Apply Internships", itemLink: "applyInternships", itemIcon: VscGitStashApply},
    {itemId: 3, itemTitle: "Fill Biodata Form", itemLink: "fillBiodataForm", itemIcon: FaTableCells}
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

export default StudentDashboard;