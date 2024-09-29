import { useSelector } from 'react-redux';


const AdminDefaultPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);


  return (
    <div>
      <h1 className="text-3xl m-2 md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mt-4 md:mt-6 lg:mt-8">
        Hello, {currentUser.firstName}
      </h1>
      <div className="">
        
      </div>
    </div>
  );
}

export default AdminDefaultPage;
