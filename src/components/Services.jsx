import { Button, Card, CardBody, CardFooter, CardHeader, Typography } from '@material-tailwind/react';
import { useState } from 'react'; 
import { FaUserPlus, FaUserTimes } from 'react-icons/fa';
import { RiUserSearchFill } from 'react-icons/ri';
import { useNavigate } from 'react-router-dom';

const Services = ({role="User", servicesGiven}) => {
  // services given will be an array of the following - linkTo, Icon, serviceDetail

  console.log(servicesGiven);
  const [showServices, setShowServices] = useState(true);

  const handleToggleServices = () => {
    setShowServices(prev => !prev);
  };

  return (
    <div className="m-2 my-4">
      <div className="flex gap-3 flex-wrap justify-between items-center mb-2">
        <h1 className="text-md md:text-xl m-2 font-semibold">
          As {role} Of this system you can do the following things.
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
        {servicesGiven.map(service => (
          <ServiceGiven key={service.linkTo} linkTo={service.linkTo} Icon={service.Icon} serviceDetail={service.serviceDetail} />)
        )}
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

export default Services;