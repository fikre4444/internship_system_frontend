import { useLocation } from 'react-router-dom';
import { useState } from 'react';
import { Switch } from '@material-tailwind/react';

const ViewAndEditAccount = () => {
  const [ isEditing, setIsEditing ] = useState(false);
  
  const location = useLocation();
  let account = location.state;
  if(account === null){
    return (
      <div className="flex flex-col gap-3 justify-center items-center">
        <h1 
          className="m-3 my-8 text-lg md:text-xl lg:text-2xl font-semibold bg-blue-300 bg-opacity-20 rounded-3xl shadow-2xl text-blue-gray-700 p-6 inline-block"
        >
          There Is No Account To Be Displayed.
        </h1>
        <h2 className="text-sm md:text-md lg:text-lg font-semibold text-blue-gray-800">
          You have to click on an account first to view an account.
        </h2>
      </div>
    )
  }
  
  return (
    <div>
      <HeaderComponent isEditing={isEditing} setIsEditing={setIsEditing} /> 
      

      <UserInfo account={account} />
      <UserAccount  account={account} />
      
    </div>
  );
}

export default ViewAndEditAccount;

const HeaderComponent = ({isEditing, setIsEditing}) => {

  return (
    <header className="p-2 flex items-center justify-between flex-wrap">
      <h1 className="text-2xl lg:text-3xl text-blue-gray-800 font-semibold">
        {!isEditing ? 'View Account' : 'Edit Account'}
      </h1>
      <div className="flex items-center justify-center gap-3 bg-gray-100 rounded-lg p-1 w-40 md:w-48">
        <label className="font-serif font-semibold text-sm md:text-lg lg:text-2xl text-gray-800">
          Switch View
        </label>
        <Switch onClick={() => setIsEditing(prevState => !prevState)} 
          className="h-full w-full checked:bg-[#071809]"
          containerProps={{
            className: "w-11 h-6",
          }}
          circleProps={{
            className: "before:hidden left-0.5 border-none",
          }}  
        />
      </div>
    </header>
  );

}

const UserInfo = ({ account }) => {
  return (
    <div className="p-3 shadow-lg">
      <h1 className="font-inter font-bold text-2xl">Personal Info</h1>
      <table className="m-2">
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-lg font-bold border-r-2 border-white">First Name</td>
          <td className="bg-gray-400 text-left p-2 font-inter text-lg font-bold">{account.firstName}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-lg font-bold border-r-2 border-white">Last Name</td>
          <td className="bg-gray-400 text-left p-2 font-inter text-lg font-bold">{account.lastName}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-lg font-bold border-r-2 border-white">Username</td>
          <td className="bg-gray-400 text-left p-2 font-inter text-lg font-bold">{account.username}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-lg font-bold border-r-2 border-white">Email</td>
          <td className="bg-gray-400 text-left p-2 font-inter text-lg font-bold">{account.email}</td>
        </tr>
        <tr className="bg-blue-gray-100 border-b-2 border-gray-100">
          <td className="text-right p-2 font-inter text-lg font-bold border-r-2 border-white">Gender</td>
          <td className="bg-gray-400 text-left p-2 text-lg font-bold lowercase font-inter">{account.gender}</td>
        </tr>
      </table>
    </div>
  )
}

const UserAccount = ({ account }) => {
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        

        {/* Account Status Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Enabled</label>
            <p className="mt-1 text-gray-900">{account.enabled ? 'Yes' : 'No'}</p>
          </div>
        </div>

        {/* Role and Department Section */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-600">Role</label>
            <p className="mt-1 text-gray-900">{account.roles[0].name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-600">Department</label>
            <p className="mt-1 text-gray-900">{account.department.name}</p>
          </div>
        </div>

        {/* Course Load */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-600">Course Load</label>
          <p className="mt-1 text-gray-900">{account.courseLoad}</p>
        </div>

        {/* Edit Button */}
        <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200">
          Edit Account
        </button>
      </div>
    </div>
  );
};



