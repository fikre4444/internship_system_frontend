// import { Tooltip } from '@material-tailwind/react';
// import { RiNotification2Fill } from "react-icons/ri";
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoCloseSharp } from "react-icons/io5"; // Import for close icon

// const NotificationButton = ({ icon=<RiNotification2Fill size={45} />, tooltipMessage="Click To View Your Notifications." }) => {
//   const token = useSelector(state => state.user.token);
//   const [notifications, setNotifications] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const getNotifications = async () => {
//       try {
//         const response = await axios.get("/api/account/get-notifications", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.status === 200) {
//           // Sort notifications by date, most recent first
//           const sortedNotifications = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
//           console.log(sortedNotifications)
//           setNotifications(sortedNotifications);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications", error);
//       }
//     };

//     getNotifications();
//   }, [token]);

//   const handleClick = () => {
//     setIsModalOpen(!isModalOpen); // Toggle modal visibility
//   };

//   const handleClose = () => {
//     setIsModalOpen(false); // Close modal
//   };

//   return (
//     <>
//       <Tooltip content={tooltipMessage} placement="top" className="bg-green-200 text-green-900 shadow-lg">
//         <button
//           onClick={handleClick}
//           className="w-14 h-14 bg-blue-100/30 border border-blue-200/50 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:animate-none
//           animate-heartbeat transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-blue-200/50"
//         >
//           {icon}
//         </button>
//       </Tooltip>

//       {isModalOpen && (
//         <>
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={handleClose}
//           ></div>

//           {/* Notifications Modal */}
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="relative bg-blue-500 bg-opacity-15 backdrop-blur-lg border border-gray-300/30 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
//               {/* Close button */}
//               <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors">
//                 <IoCloseSharp size={24} />
//               </button>

//               <h2 className="text-xl font-semibold text-center mb-4 text-white">Notifications</h2>
              
//               {notifications.length > 0 ? (
//                 <ul className="space-y-4">
//                   {notifications.map((notification) => (
//                     <li key={notification.id} className="p-4 rounded-lg bg-white/20 backdrop-blur-md text-white shadow-md">
//                       <p className="text-sm font-bold">{notification.sentBy.firstName}</p>
//                       <p className="text-xs">{new Date(notification.createdDate).toLocaleString()}</p>
//                       <p className="mt-2">{notification.content}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-gray-200">No notifications</p>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default NotificationButton;


// import { Badge, Tooltip } from '@material-tailwind/react';
// import { RiNotification2Fill } from "react-icons/ri";
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoCloseSharp } from "react-icons/io5";

// const NotificationButton = ({ icon=<RiNotification2Fill size={45} />, tooltipMessage="Click To View Your Notifications." }) => {
//   const token = useSelector(state => state.user.token);
//   const [notifications, setNotifications] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const getNotifications = async () => {
//       try {
//         const response = await axios.get("/api/account/get-notifications", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.status === 200) {
//           // Sort notifications by date, most recent first
//           const sortedNotifications = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
//           setNotifications(sortedNotifications);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications", error);
//       }
//     };

//     getNotifications();
//   }, [token]);

//   const handleClick = () => {
//     setIsModalOpen(!isModalOpen); // Toggle modal visibility
//   };

//   const handleClose = () => {
//     setIsModalOpen(false); // Close modal
//   };

//   const markAllAsRead = async () => {
//     try {
//       // Filter unread notifications
//       const unreadNotifications = notifications.filter(notification => notification.status === 'unread');

//       // Send a request for each unread notification to mark it as read
//       await Promise.all(
//         unreadNotifications.map(notification => 
//           axios.post(`/api/account/mark-notification-read/${notification.id}`, {}, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//         )
//       );

//       // Update the notification statuses locally
//       const updatedNotifications = notifications.map(notification =>
//         notification.status === 'unread' ? { ...notification, status: 'read' } : notification
//       );
//       setNotifications(updatedNotifications);

//     } catch (error) {
//       console.error("Error marking notifications as read", error);
//     }
//   };

//   return (
//     <>
//       <Tooltip content={tooltipMessage} placement="top" className="bg-green-200 text-green-900 shadow-lg">
//         <button
//           onClick={handleClick}
//           className="w-14 h-14 bg-blue-100/30 border border-blue-200/50 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:animate-none
//           animate-heartbeat transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-blue-200/50"
//         >
//           {icon}
//         </button>
//       </Tooltip>

//       {isModalOpen && (
//         <>
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={handleClose}
//           ></div>

//           {/* Notifications Modal */}
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="relative bg-blue-500 bg-opacity-15 backdrop-blur-lg border border-gray-300/30 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
//               {/* Close button */}
//               <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors">
//                 <IoCloseSharp size={24} />
//               </button>

//               <h2 className="text-xl font-semibold text-center mb-4 text-white">Notifications</h2>
              
//               {/* Mark All as Read Button */}
//               <button 
//                 onClick={markAllAsRead} 
//                 className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
//                 Mark All as Read
//               </button>

//               {notifications.length > 0 ? (
//                 <ul className="space-y-4">
//                   {notifications.map((notification) => (
//                     <li 
//                       key={notification.id} 
//                       className={`p-4 rounded-lg shadow-md ${notification.status === 'unread' ? 'bg-red-500/20' : 'bg-white/20'} 
//                       backdrop-blur-md text-white`}
//                     >
//                       <Badge color='red'>Unread</Badge>
//                       <p className="text-sm font-bold">{notification.sentBy.firstName}</p>
//                       <p className="text-xs">{new Date(notification.createdDate).toLocaleString()}</p>
//                       <p className="mt-2">{notification.content}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-gray-200">No notifications</p>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default NotificationButton;


// import { Tooltip } from '@material-tailwind/react';
// import { RiNotification2Fill } from "react-icons/ri";
// import { useSelector } from 'react-redux';
// import axios from 'axios';
// import { useEffect, useState } from 'react';
// import { IoCloseSharp } from "react-icons/io5";

// const NotificationButton = ({ icon=<RiNotification2Fill size={45} />, tooltipMessage="Click To View Your Notifications." }) => {
//   const token = useSelector(state => state.user.token);
//   const [notifications, setNotifications] = useState([]);
//   const [isModalOpen, setIsModalOpen] = useState(false);

//   useEffect(() => {
//     const getNotifications = async () => {
//       try {
//         const response = await axios.get("/api/account/get-notifications", {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         if (response.status === 200) {
//           // Sort notifications by date, most recent first
//           const sortedNotifications = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
//           setNotifications(sortedNotifications);
//         }
//       } catch (error) {
//         console.error("Error fetching notifications", error);
//       }
//     };

//     getNotifications();
//   }, [token]);

//   const handleClick = () => {
//     setIsModalOpen(!isModalOpen); // Toggle modal visibility
//   };

//   const handleClose = () => {
//     setIsModalOpen(false); // Close modal
//   };

//   const markAllAsRead = async () => {
//     // Filter and log unread notifications
//     const unreadNotifications = notifications.filter(notification => notification.status === 'unread');
//     console.log("Unread Notifications:", unreadNotifications);

//     try {
//       // Send a request for each unread notification to mark it as read
//       await Promise.all(
//         unreadNotifications.map(notification => 
//           axios.post(`/api/account/mark-notification-read/${notification.id}`, {}, {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           })
//         )
//       );

//       // Update the notification statuses locally
//       const updatedNotifications = notifications.map(notification =>
//         notification.status === 'unread' ? { ...notification, status: 'read' } : notification
//       );
//       setNotifications(updatedNotifications);

//     } catch (error) {
//       console.error("Error marking notifications as read", error);
//     }
//   };

//   return (
//     <>
//       <Tooltip content={tooltipMessage} placement="top" className="bg-green-200 text-green-900 shadow-lg">
//         <button
//           onClick={handleClick}
//           className="w-14 h-14 bg-blue-100/30 border border-blue-200/50 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:animate-none
//           animate-heartbeat transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-blue-200/50"
//         >
//           {icon}
//         </button>
//       </Tooltip>

//       {isModalOpen && (
//         <>
//           {/* Backdrop */}
//           <div 
//             className="fixed inset-0 bg-black bg-opacity-50 z-40"
//             onClick={handleClose}
//           ></div>

//           {/* Notifications Modal */}
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             <div className="relative bg-blue-500 bg-opacity-15 backdrop-blur-lg border border-gray-300/30 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
//               {/* Close button */}
//               <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors">
//                 <IoCloseSharp size={24} />
//               </button>

//               <h2 className="text-xl font-semibold text-center mb-4 text-white">Notifications</h2>
              
//               {/* Mark All as Read Button */}
//               <button 
//                 onClick={markAllAsRead} 
//                 className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
//                 Mark All as Read
//               </button>

//               {notifications.length > 0 ? (
//                 <ul className="space-y-4">
//                   {notifications.map((notification) => (
//                     <li 
//                       key={notification.id} 
//                       className={`relative p-4 rounded-lg shadow-md ${
//                         notification.status === 'unread' ? 'bg-red-500/20' : 'bg-white/20'
//                       } backdrop-blur-md text-white`}
//                     >
//                       {/* Unread Badge */}
//                       {notification.status === 'unread' && (
//                         <span className="absolute top-2 right-2 bg-red-600 text-xs text-white px-2 py-0.5 rounded-full">
//                           Not Read
//                         </span>
//                       )}
                      
//                       <p className="text-sm font-bold">{notification.sentBy.firstName}</p>
//                       <p className="text-xs">{new Date(notification.createdDate).toLocaleString()}</p>
//                       <p className="mt-2">{notification.content}</p>
//                     </li>
//                   ))}
//                 </ul>
//               ) : (
//                 <p className="text-center text-gray-200">No notifications</p>
//               )}
//             </div>
//           </div>
//         </>
//       )}
//     </>
//   );
// };

// export default NotificationButton;

import { Tooltip } from '@material-tailwind/react';
import { RiNotification2Fill } from "react-icons/ri";
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { IoCloseSharp } from "react-icons/io5";
import { toast } from 'react-toastify';

const NotificationButton = ({ icon=<RiNotification2Fill size={45} />, tooltipMessage="Click To View Your Notifications." }) => {
  const token = useSelector(state => state.user.token);
  const [notifications, setNotifications] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getNotifications = async () => {
      try {
        const response = await axios.get("/api/account/get-notifications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          const sortedNotifications = response.data.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate));
          setNotifications(sortedNotifications);
        }
      } catch (error) {
        console.error("Error fetching notifications", error);
      }
    };

    getNotifications();
  }, [token]);

  const handleClick = () => {
    setIsModalOpen(!isModalOpen); // Toggle modal visibility
  };

  const handleClose = () => {
    setIsModalOpen(false); // Close modal
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter(notification => notification.status === 'unread');
    console.log("Unread Notifications:", unreadNotifications);

    try {
      const notificationIds = unreadNotifications.map(notification => {
        return notification.id;
      });

      const response = await axios.put(`/api/account/mark-all-as-read`, notificationIds, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedNotifications = notifications.map(notification =>
        notification.status === 'unread' ? { ...notification, status: 'read' } : notification
      );
      setNotifications(updatedNotifications);

    } catch (error) {
      console.error("Error marking notifications as read", error);
    }
  };

  const markSingleAsRead = async (notificationId) => {
    try {
      const response = await axios.put(`/api/account/mark-notification-as-read?notificationId=${notificationId}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if(response.data.result === "success"){
        const updatedNotifications = notifications.map(notification =>
          notification.id === notificationId ? { ...notification, status: 'read' } : notification
        );
        setNotifications(updatedNotifications);
      }
      else {
        toast.error("There was an error while communicating with server.");
      }

    } catch (error) {
      console.error(`Error marking notification ${notificationId} as read`, error);
    }
  };

  return (
    <>
      <Tooltip content={tooltipMessage} placement="top" className="bg-green-200 text-green-900 shadow-lg">
        <button
          onClick={handleClick}
          className="w-14 h-14 bg-blue-100/30 border border-blue-200/50 backdrop-blur-md rounded-full flex items-center justify-center text-blue-500 hover:animate-none
          animate-heartbeat transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl hover:bg-blue-200/50"
        >
          {icon}
        </button>
      </Tooltip>

      {isModalOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={handleClose}
          ></div>

          {/* Notifications Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="relative bg-blue-500 bg-opacity-15 backdrop-blur-lg border border-gray-300/30 rounded-xl shadow-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto scrollbar-hide">
              {/* Close button */}
              <button onClick={handleClose} className="absolute top-2 right-2 text-white hover:text-gray-300 transition-colors">
                <IoCloseSharp size={24} />
              </button>

              <h2 className="text-xl font-semibold text-center mb-4 text-white">Notifications</h2>
              
              {/* Mark All as Read Button */}
              <button 
                onClick={markAllAsRead} 
                className="mb-4 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                Mark All as Read
              </button>

              {notifications.length > 0 ? (
                <ul className="space-y-4">
                  {notifications.map((notification) => (
                    <li 
                      key={notification.id} 
                      className={`relative p-4 rounded-lg shadow-md ${
                        notification.status === 'unread' ? 'bg-red-500/20' : 'bg-white/20'
                      } backdrop-blur-md text-white`}
                    >
                      {/* Unread Badge and Mark as Read Button */}
                      {notification.status === 'unread' && (
                        <>
                          <span className="absolute top-2 right-2 bg-red-600 text-xs text-white px-2 py-0.5 rounded-full">
                            Unread
                          </span>
                          <button
                            onClick={() => markSingleAsRead(notification.id)}
                            className="absolute bottom-2 right-2 bg-green-500 text-xs text-white px-2 py-1 rounded hover:bg-green-600 transition-colors"
                          >
                            Mark as Read
                          </button>
                        </>
                      )}
                      
                      <p className="text-sm font-bold">{notification.sentBy.firstName}</p>
                      <p className="text-xs">{new Date(notification.createdDate).toLocaleString()}</p>
                      <p className="mt-2">{notification.content}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center text-gray-200">No notifications</p>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default NotificationButton;


