import { useNavigate } from 'react-router-dom';
import hero1 from '../assets/hero1.jpg';
import { PiStudentFill } from "react-icons/pi";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { MdOutlineManageAccounts } from "react-icons/md";


const Homepage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      
      
      <div className="w-full bg-center bg-cover h-[38rem]" 
        style={{
          backgroundImage: `url(${hero1})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
          <div className="flex items-center justify-center w-full h-full bg-gray-900/40">
              <div className="text-center">
                  <h1 className="text-3xl font-semibold text-white lg:text-4xl">Learn and grow in a way  <span className="text-blue-400">that you were meant to be.</span> .</h1>
                  <button onClick={() => {navigate("/about")}} className="w-full px-5 py-2 mt-4 text-xl font-medium text-white capitalize transition-colors duration-300 transform bg-blue-600 rounded-md lg:w-auto hover:bg-blue-500 focus:outline-none focus:bg-blue-500">Learn More about IMS</button>
              </div>
          </div>
      </div>


      <div className="w-full bg-blue-50 px-10 py-10 mx-auto">
          <h1 className="text-2xl font-semibold text-center text-gray-800 capitalize lg:text-3xl">Learn about the different <br/> functionalities <span className="text-blue-500">of our system</span></h1>

          <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-16 md:grid-cols-2 xl:grid-cols-3">
              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-white rounded-xl">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
                      <PiStudentFill size="50"/>
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 capitalize">Students</h1>

                  <p className="text-gray-500">
                      Can use this app to manage (which has many things included in) their internships and get in touch with their advisors. 
                  </p>

                 
              </div>

              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-white rounded-xl">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
                      <MdOutlineManageAccounts size="50"/>
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 capitalize">Coordinators</h1>

                  <p className="text-gray-500">
                     Can use this app to coordinate everything for the internship semester. This includes the Head Coordintor and Department Coordinators.
                  </p>

                  
              </div>

              <div className="flex flex-col items-center p-6 space-y-3 text-center bg-white rounded-xl">
                  <span className="inline-block p-3 text-blue-500 bg-blue-100 rounded-full">
                    <PiChalkboardTeacherFill size="50"/>
                  </span>

                  <h1 className="text-xl font-semibold text-gray-700 capitalize">Advisors</h1>

                  <p className="text-gray-500">
                      Can use this app to learn about the list of students assigned to them and they can also get in touch with their students.
                  </p>

                  
              </div>
          </div>
      </div>  

      <div className="container px-6 py-16 mx-auto text-center">
          <div className="max-w-lg mx-auto">
              <h1 className="text-3xl font-semibold text-gray-800 lg:text-4xl">You can start by logging into the website</h1>

              <p className="mt-6 text-gray-500 ">
                  If you do not have an account, you have to request for a registration, by going to the administrator office.
              </p>

              <div className="w-full max-w-sm mx-auto mt-6 bg-transparent border rounded-md  focus-within:border-blue-400 focus-within:ring focus-within:ring-blue-300  focus-within:ring-opacity-40">
                  <button onClick={() => {navigate("/login")}} type="button" className=" w-[70%] h-10 px-4 py-2 m-1 text-white transition-colors duration-300 transform bg-blue-500 rounded-md hover:bg-blue-400 focus:outline-none focus:bg-blue-400">
                      Get Started
                  </button>
              </div>
          </div>
      </div>
    </div>
  )
}

export default Homepage;
