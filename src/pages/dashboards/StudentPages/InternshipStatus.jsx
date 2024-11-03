import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import axios from 'axios';


const InternshipStatus = () => {
  const token = useSelector(state => state.user.token);
  const currentUser = useSelector(state => state.user.currentUser);
  const [currentInternship, setCurrentInternship] = useState(null);

  useEffect(() => {
    const getInternship = async () => {
      const response = await axios.get("/api/student/get-self-secured-internship?username="+currentUser.username, {
        headers: {
          "authorization" :  `Bearer ${token}`
        }
      });
      if(response.status === 200){
        setCurrentInternship(response.data.selfInternship)
      }
    }
    getInternship();
  }, [])

  return (
    <div>
      <div className="flex justify-center mx-auto my-3">
        <h1 className="text-lg md:text-2xl lg:text-3xl font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
          Internship Status
        </h1>
      </div>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max">
          This is where you can track your internship status. Your currently Internship status is your self secured one.
        </p>
      </div>
      <div>
        {JSON.stringify(currentInternship)}
      </div>
    </div>
  )
}

export default InternshipStatus
