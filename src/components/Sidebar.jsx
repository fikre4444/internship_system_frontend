import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect } from 'react';


const SidebarComp = ({className, collapsed, setCollapsed, toggled, setToggled, sidebarItems}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width:768px)');
    setIsSmallScreen(mediaQuery.matches);
    const handleResize = () => {
      setIsSmallScreen(mediaQuery.matches);
    }
    mediaQuery.addEventListener('change', handleResize);
    return () => {mediaQuery.removeEventListener('change', handleResize)};
  }, [])




  const sidebarStyle="h-[calc(100vh-9vh)] "+className;

  const handleToggle = () => { setToggled(toggled) }
  const handleCollapse = () => { setCollapsed(collapsed) }
  
  
  return (
      <Sidebar 
        className={sidebarStyle}
        onBackdropClick={isSmallScreen ?  () => { setToggled(false) } : undefined } 
        breakPoint={ isSmallScreen ? "md" : undefined } 
        toggled={isSmallScreen ? toggled : undefined } 
        collapsed={ !isSmallScreen ? collapsed : undefined} 
      >
        <Menu>
          <MenuItem 
            onClick={() => isSmallScreen ? setToggled(!toggled) : setCollapsed(!collapsed)} 
            icon={isSmallScreen ? <div>X</div> : <RxHamburgerMenu />}
          >
              Menu
          </MenuItem>
          {sidebarItems.map(item => {
            return (
              <Link key={item.itemId} to={item.itemLink}>
                <MenuItem icon={item.itemIcon ? <item.itemIcon /> : undefined }>{item.itemTitle}</MenuItem>
              </Link>
            );
          })}
        </Menu>
      </Sidebar>
  );
}

export default SidebarComp;

