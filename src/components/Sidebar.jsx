import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useState, useEffect } from 'react';
import { IconButton } from '@material-tailwind/react';


const SidebarComp = ({className, collapsed, setCollapsed, toggled, setToggled, sidebarItems}) => {
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [key, setKey] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();
  //since we have a lot of element separted by the '/' we need to get the last one.
  const currentPath = location.pathname.split('/').pop();

  useEffect(() => {
    const mediaQuery = window.matchMedia('(max-width:720px)');
    setIsSmallScreen(mediaQuery.matches);
    const handleResize = () => {
      setIsSmallScreen(mediaQuery.matches);
      setKey(prevKey => prevKey + 1);
    }
    mediaQuery.addEventListener('change', handleResize);
    return () => {mediaQuery.removeEventListener('change', handleResize)};
  }, [])




  const sidebarStyle="h-[calc(100vh-9vh)] "+className;

  const handleToggle = () => { setToggled(toggled) }
  const handleCollapse = () => { setCollapsed(collapsed) }
  
  
  return (
      <>
        <IconButton className="m-1 rounded-full bg-blue-gray-500 block md:hidden" onClick={() => setToggled(!toggled)}>
          <RxHamburgerMenu size={25} />
        </IconButton>
        <Sidebar 
          className={sidebarStyle}
          onBackdropClick={isSmallScreen ?  () => { setToggled(false) } : undefined } 
          breakPoint={ isSmallScreen ? "md" : undefined } 
          toggled={isSmallScreen ? toggled : undefined } 
          collapsed={ !isSmallScreen ? collapsed : undefined} 
          key={key}
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
                <MenuItem 
                  className={currentPath === item.itemLink ? "bg-green-900 bg-opacity-40" : ""}
                  key={item.itemId}
                  onClick={() => {setToggled(!toggled); navigate(item.itemLink)}} 
                  icon={item.itemIcon ? <item.itemIcon /> : undefined }
                >
                  {item.itemTitle}
                </MenuItem>
              );
            })}
          </Menu>
        </Sidebar>
      </>
  );
}

export default SidebarComp;

