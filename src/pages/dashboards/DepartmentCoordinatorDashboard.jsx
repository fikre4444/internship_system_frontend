import { useState } from "react";
import SidebarComp from "../../components/Sidebar";
import { Outlet } from "react-router-dom";
import { FaRegistered, FaUserCog } from "react-icons/fa";
import { MdAddToPhotos } from "react-icons/md";

const DepartmentCoordinatorDashboard = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const sidebarItems = [
    {itemId: 1, itemTitle: "First Depatment Coodinator page", itemLink: "departmentCoordinatorPage1", itemIcon: FaUserCog},
    {itemId: 2, itemTitle: "Second Depatment Coodinator page", itemLink: "departmentCoordinatorPage2", itemIcon: FaRegistered},
    {itemId: 3, itemTitle: "Add Student Internship", itemLink: "addStudentInternship", itemIcon: MdAddToPhotos}
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

export default DepartmentCoordinatorDashboard;