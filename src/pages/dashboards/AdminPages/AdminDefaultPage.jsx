import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import { PieChart, Pie, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import Loader from '../../../components/Loader';
import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { FaSearch } from 'react-icons/fa';
import { FaUserPlus } from "react-icons/fa";
import { RiUserSearchFill } from "react-icons/ri";
import { FaUserTimes } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';


const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const AdminDefaultPage = () => {
  const currentUser = useSelector(state => state.user.currentUser);

  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [successfulResponse, setSuccessfulResponse] = useState(false);
  const [departmentStats, setDepartmentStats] = useState(null);
  const [accountTypeStats, setAccountTypeStats] = useState(null);

  
  useEffect(() => {
    const fetchData = async () => {
      setIsLoadingStats(true);
      try{
        const response = await axios.get("/api/admin/get-stats");
        await sleep(2000);
        if(response.status === 200){
          const data = response.data;
          setAccountTypeStats(data.accountTypeData);
          setDepartmentStats(data.departmentData);
          setSuccessfulResponse(true);
        }
        else {
          setSuccessfulResponse(false);
        }
      } catch(error) {
        console.log(error);
        setSuccessfulResponse(false);
      } finally {
        setIsLoadingStats(false);
      }
      
    };
    if(accountTypeStats == null || departmentStats == null)
      fetchData();
  }, []);

  

  return (
    <div>
      <h1 className="text-3xl m-2 md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-gray-200 mt-4 md:mt-6 lg:mt-8">
        Hello, {currentUser.firstName}
      </h1>
      <div className="bg-blue-gray-400 shadow-sm bg-opacity-5 py-3">
        <Services />
      </div>
      { isLoadingStats ?
        <div><Loader message="Fetching Stats, please wait..." /></div>
        : successfulResponse ? 
          <div className="bg-green-200 bg-opacity-20 p-3 pb-6">
            <h1 className="text-lg font-semibold tracking-wide mb-2 text-gray-700">Admin Stats</h1>
            <div className="flex flex-wrap gap-5 justify-center space-x-8">
              <StudentStaffChart data={accountTypeStats} />
              <DepartmentBarChart data={departmentStats} />
            </div>
          </div>
        :
        <div>
          There was an error while loading stats.
        </div>

      }
      
    </div>
  );
}

export default AdminDefaultPage;


const Services = () => {
  const [showServices, setShowServices] = useState(true);

  const handleToggleServices = () => {
    setShowServices(prev => !prev);
  };

  return (
    <div className="m-2 my-4">
      <div className="flex gap-3 flex-wrap justify-between items-center mb-2">
        <h1 className="text-md md:text-xl m-2 font-semibold">
          As An Administrator Of this system you can do the following things.
        </h1>
        <Button className="py-3 px-8 bg-red-300" onClick={handleToggleServices}>
          {showServices ? "Hide This" : "Show Functionalities"}
        </Button>
      </div>

      {/* Animated Services Section */}
      <div
        className={`flex gap-3 flex-wrap justify-evenly transition-opacity duration-500 ease-in-out ${
          showServices ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
        }`}
      >
        <ServiceGiven linkTo="registerUser" Icon={FaUserPlus} serviceDetail={"You Can Register Users using different ways."} />
        <ServiceGiven linkTo="searchUser" Icon={RiUserSearchFill} serviceDetail={"You can Search Users in multiple ways and edit the accounts"} />
        <ServiceGiven linkTo="deleteUser" Icon={FaUserTimes} serviceDetail={"You can Remove Users by first Searching them"} />
      </div>
    </div>
  );
};


const ServiceGiven = ({Icon, serviceDetail, className, linkTo}) => {
  const navigate = useNavigate();

  return (
    <div className={" "+className}>
      <Card className="mt-6 w-72 scale-90 hover:scale-105 transition-transform duration-200">
        <CardHeader className="relative h-36 bg-blue-50">
          <div className="w-full flex p-2 justify-center">
            <span className="inline-block m-2 p-3 text-blue-500 bg-blue-100 rounded-full">
              <Icon size={70} />
            </span>
          </div>
        </CardHeader>
        <CardBody>
          <Typography>
            {serviceDetail}
          </Typography>
        </CardBody>
        <CardFooter className="pt-0 flex justify-center w-full">
          <Button onClick={() => {navigate(linkTo)}} 
            className="capitalize text-sm bg-blue-gray-500"
          >
            Go To the Page
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}


const DepartmentBarChart = ({ data }) => {

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF6384', '#36A2EB'];

  return (
    <div className="bg-blue-300 bg-opacity-25 shadow-md p-2 rounded-lg">
      <ResponsiveContainer width={500} height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="department" angle={-30} textAnchor="end"/>
          <YAxis />
          <Tooltip content={<CustomTooltip2 />} />
          <Legend />
          <Bar
            dataKey="accounts"
            fill="#8884d8"
            isAnimationActive={true}
            animationBegin={400}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

const StudentStaffChart = ({data}) => {
  const COLORS = ['#0088FE', '#00C49F'];
  return (
    <div className="bg-blue-300 bg-opacity-25 shadow-md p-2 rounded-lg">
      <ResponsiveContainer width={400} height={350}>
        <PieChart>
          <Pie
            data={data} dataKey="value" nameKey="name" cx="50%" cy="50%"
            outerRadius={150} fill="#8884d8"
            label isAnimationActive={true} animationBegin={400}
            animationDuration={1500}   
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />}/>
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const name = payload[0].name;
    const value = payload[0].value;
    
    // Customize the tooltip message based on the name
    const message =
      name === 'Students'
        ? `You have ${value} students currently registered.`
        : `You have ${value} staff currently registered.`;
    
    return (
      <div className="custom-tooltip bg-white p-2 shadow-lg rounded-lg">
        <p className="label">{message}</p>
      </div>
    );
  }

  return null;
};

// Custom tooltip for the bar chart
const CustomTooltip2 = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const department = payload[0].payload.department;
    const accounts = payload[0].value;

    return (
      <div className="custom-tooltip bg-white p-2 shadow-lg rounded-lg">
        <p>{`${department}: ${accounts} accounts`}</p>
      </div>
    );
  }

  return null;
};
