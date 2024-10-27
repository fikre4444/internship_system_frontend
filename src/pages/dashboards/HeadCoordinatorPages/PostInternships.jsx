import { Button, Input, Option, Select } from '@material-tailwind/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import { sleep } from '../../../utils/otherUtils';
import { useSelector } from "react-redux";
import SlideDown from '../../../HOCS/SlideDown';


const PostInternships = () => {
  return (
    <div className="m-3">
      <h1 className=" mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
        This is the Post Internships Page, where you can Post Internships for different departments.
      </h1>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          To Post Internships, Click the + button to add a row and then fill in the blanks and click post.
        </p>   
        {/* <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-green-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          You can also send an email to the organizations, representatives and then they can fill it.
        </p>            */}
      </div>
      <PostInternshipsComponent />
    </div>
  );
}

export default PostInternships;

const PostInternshipsComponent = () => {
  const token = useSelector(state => state.user.token);

  const [rows, setRows] = useState([
    { id: Date.now(), companyName: "", location: "", numStudents: "", department: "", pocketMoney: "" },
  ]);
  const [errors, setErrors] = useState({});
  const [isConfirming, setIsConfirming] = useState(false); // Toggle between form and confirmation view
  const [confirmedRows, setConfirmedRows] = useState([]); // Store rows for confirmation

  const [ isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (id, field, newValue) => {
    setRows((prevRows) =>
      prevRows.map((row) =>
        row.id === id ? { ...row, [field]: newValue } : row
      )
    );
    setErrors((prevErrors) => ({ ...prevErrors, [id]: "" })); // Reset error for the changed input
  };

  const addRow = () => {
    setRows([...rows, { id: Date.now(), companyName: "", location: "", numStudents: "", department: "", pocketMoney: "" }]);
  };

  const removeRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  const postInternships = () => {
    // Filter rows with all inputs filled
    const filledRows = rows
      .filter(
        (row) =>
          row.companyName &&
          row.location &&
          row.numStudents &&
          row.department &&
          row.pocketMoney !== ""
      )
      .map((row) => ({
        companyName: row.companyName,
        location: row.location,
        noOfStudents: Number(row.numStudents),
        department: row.department,
        pocketMoney: row.pocketMoney === "true", // Convert string to boolean
        internshipStatus: "available",
        typeOfInternship: "MU_PROVIDED",
      }));

    setConfirmedRows(filledRows); // Store filtered data for confirmation
    setIsConfirming(true); // Switch to confirmation view
  };

  const confirmPost = async () => {
    console.log("Confirmed Internships Data:", confirmedRows); // Final data to be submitted
    setIsSubmitting(true);
    const submittingToastId = toast.loading("Submitting Internships...");
    toast.update(submittingToastId, {closeButton: true});
    await sleep(1000);
    try {
      const response = await axios.post("/api/head-coordinator/post-internship-opportunities",
        confirmedRows, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });
      if(response.status === 200){
        console.log(response.data);
        toast.update(submittingToastId, {
          render: "Successfully Posted the Internships!",
          type: "success",
          isLoading: false,
          autoClose: 1000
        });
        clearEverything();
      }
    }catch(error){
      console.log(error);
      toast.update(submittingToastId, {
        render: "There was an error while Posting the internships!",
        type: "error", 
        isLoading: false,
        autoClose: 1000
      });
    }finally{
      setIsSubmitting(false);
      setIsConfirming(false);
    }
    
  };

  const clearEverything = () => {
    setRows([
      { id: Date.now(), companyName: "", location: "", numStudents: "", department: "", pocketMoney: "" },
    ]);
    setConfirmedRows([]);
    setErrors({});
  }

  const cancelConfirmation = () => {
    setIsConfirming(false); // Return to input form view
  };

  return (
    <div>
      {isConfirming ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Confirm Internship Postings</h2>
          <h2 className="text-sm font-semibold text-red-500 mb-4">Note That, Rows that weren't Fully Filled, have been left out.</h2>
          <table className="table-auto w-full text-left border">
            <thead>
              <tr className="bg-blue-100 bg-opacity-60">
                <th className="border px-4 py-2">Company Name</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Number of Students</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Pocket Money</th>
                <th className="border px-4 py-2">Internship Status</th>
                <th className="border px-4 py-2">Type of Internship</th>
              </tr>
            </thead>
            <tbody>
              {confirmedRows.map((row, index) => (
                <tr key={index} className="bg-green-100 bg-opacity-60">
                  <td className="border px-4 py-2">{row.companyName}</td>
                  <td className="border px-4 py-2">{row.location}</td>
                  <td className="border px-4 py-2">{row.noOfStudents}</td>
                  <td className="border px-4 py-2">{row.department}</td>
                  <td className="border px-4 py-2">{row.pocketMoney ? "Yes" : "No"}</td>
                  <td className="border px-4 py-2">{row.internshipStatus}</td>
                  <td className="border px-4 py-2">{row.typeOfInternship}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-4">
            <Button onClick={confirmPost} className="bg-blue-500 text-white px-4 py-2 rounded">Confirm</Button>
            <Button onClick={cancelConfirmation} className="bg-gray-500 text-white px-4 py-2 rounded">Back to Edit</Button>
          </div>
        </div>
      ) : (
        <div>
          <div
            className="w-9 h-9 cursor-pointer hover:scale-110 hover:bg-gray-900 hover:text-gray-50 duration-100 transition-all bg-green-300 flex text-gray-200 justify-center items-center rounded-full text-3xl font-bold"
            onClick={addRow}
          >
            +
          </div>
          {rows.map((row) => (
            <div key={row.id} className="flex w-full flex-col gap-6 m-2">
              <div className="flex gap-2">
                {/* Company Name Input */}
                <Input
                  color="blue"
                  label="Company Name"
                  value={row.companyName}
                  onChange={(e) => handleInputChange(row.id, "companyName", e.target.value)}
                />
                {/* Location Input */}
                <Input
                  color="blue"
                  label="Location"
                  value={row.location}
                  onChange={(e) => handleInputChange(row.id, "location", e.target.value)}
                />
                {/* Number of Students Input */}
                <Input
                  type="number"
                  color="blue"
                  label="Number of Students"
                  value={row.numStudents}
                  onChange={(e) => handleInputChange(row.id, "numStudents", e.target.value)}
                />
                {/* Department Select Element */}
                <Select
                  label="Select Department"
                  value={row.department}
                  onChange={(val) => handleInputChange(row.id, "department", val)}
                >
                  <Option value="CHEMICAL">Chemical Engineering</Option>
                  <Option value="MECHANICAL">Mechanical Engineering</Option>
                  <Option value="INDUSTRIAL">Industrial Engineering</Option>
                  <Option value="CIVIL">Civil Engineering</Option>
                  <Option value="ELECTRICAL">Electrical Engineering</Option>
                  <Option value="ARCHITECTURE">Architecture</Option>
                </Select>
                {/* Pocket Money Select Element */}
                <Select
                  label="Pocket Money?"
                  value={row.pocketMoney}
                  onChange={(val) => handleInputChange(row.id, "pocketMoney", val)}
                >
                  <Option value="true">Yes</Option>
                  <Option value="false">No</Option>
                </Select>
                {/* Remove Row Button */}
                <button
                  onClick={() => removeRow(row.id)}
                  className="bg-red-500 text-white rounded-full px-2"
                >
                  X
                </button>
              </div>
              {errors[row.id] && (
                <span className="text-red-500 m-0 p-0 text-sm">
                  {errors[row.id]}
                </span>
              )}
            </div>
          ))}
          <Button disabled={(rows.length<1)} onClick={postInternships} className="mt-4 bg-blue-500 text-white rounded">Post Internships</Button>
        </div>
      )}
    </div>
  );
};








