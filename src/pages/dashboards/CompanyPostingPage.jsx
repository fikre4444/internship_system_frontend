import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Button, Input, Option, Select } from "@material-tailwind/react";
import { toast } from 'react-toastify';
import { sleep } from '../../utils/otherUtils'
import { useSelector } from "react-redux";

const CompanyPostingPage = () => {
  
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const jwt = queryParams.get('token');

  

  return (
    <div className="m-4">
      <h1 className=" mt-6 md:mt-3 mb-6 p-6 md:p-4 text-sm md:text-lg lg:text-xl font-semibold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 max-w-max">
        Welcome Dear Contributer, Here you can tell us the number of students you are willing to accept in your company.
      </h1>
      <div className="flex gap-3 justify-between items-center flex-wrap my-4">
        <p 
          className="my-3 text-gray-700 text-sm md:text-base bg-blue-50 border-l-4 border-blue-500 px-4 py-2 rounded-md shadow-md max-w-max"
        >
          To Enter the details, Please first fill in the Your company name and your location. After that you can add a row for each department internship and fill in the neccesary details.
        </p> 
      </div>
      <PostInternshipsComponent token={jwt}/>  
    </div>
  )
}

export default CompanyPostingPage;

const PostInternshipsComponent = ({token}) => {
  // Store Company and Location separately
  const [companyDetails, setCompanyDetails] = useState({
    companyName: "",
    location: "",
  });

  // Define rows with only department, numStudents, pocketMoney, and remove button
  const [rows, setRows] = useState([
    { id: Date.now(), department: "", numStudents: "", pocketMoney: "" },
  ]);

  const [errors, setErrors] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedRows, setConfirmedRows] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle inputs for company name and location
  const handleCompanyInputChange = (field, value) => {
    setCompanyDetails((prevDetails) => ({
      ...prevDetails,
      [field]: value,
    }));
  };

  const handleRowInputChange = (id, field, newValue) => {
    setRows((prevRows) => {
      const updatedRows = prevRows.map((row) =>
        row.id === id ? { ...row, [field]: newValue } : row
      );
  
      if (field === "department") {
        const departments = updatedRows.map((row) => row.department);
        const hasDuplicates = departments.some(
          (department, index) => department && departments.indexOf(department) !== index
        );
  
        // Set error if duplicate found and revert to previous department
        if (hasDuplicates) {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: "Department is already selected.",
          }));
          return prevRows; // Revert to the previous rows without updating
        } else {
          setErrors((prevErrors) => ({
            ...prevErrors,
            [id]: "", // Clear error if no duplicate
          }));
        }
      }
  
      return updatedRows;
    });
  };
  
  

  // Add new row with only the department, numStudents, pocketMoney, and remove button
  const addRow = () => {
    setRows([
      ...rows,
      { id: Date.now(), department: "", numStudents: "", pocketMoney: "" },
    ]);
  };

  // Remove row
  const removeRow = (id) => {
    setRows((prevRows) => prevRows.filter((row) => row.id !== id));
  };

  // Prepare data for confirmation
  const postInternships = () => {
    if (!companyDetails.companyName || !companyDetails.location) {
      toast.error("Company name and location are required.");
      return;
    }

    const filledRows = rows
      .filter((row) => row.department && row.numStudents && row.pocketMoney !== "")
      .map((row) => ({
        companyName: companyDetails.companyName,
        location: companyDetails.location,
        department: row.department,
        noOfStudents: Number(row.numStudents),
        pocketMoney: row.pocketMoney === "true",
        internshipStatus: "available",
        typeOfInternship: "MU_PROVIDED",
      }));

    setConfirmedRows(filledRows);
    setIsConfirming(true);
  };

  const confirmPost = async () => {
    console.log("Confirmed Internships Data:", confirmedRows);
    setIsSubmitting(true);
    const submittingToastId = toast.loading("Submitting Internships...");
    toast.update(submittingToastId, { closeButton: true });

    try {
      const response = await axios.post(
        "/api/company-filler/post-company-interships",
        confirmedRows,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        console.log(response.data);
        toast.update(submittingToastId, {
          render: "Successfully Posted the Internships!",
          type: "success",
          isLoading: false,
          autoClose: 1000,
        });
        clearEverything();
      }
    } catch (error) {
      console.log(error);
      toast.update(submittingToastId, {
        render: "There was an error while posting the internships!",
        type: "error",
        isLoading: false,
        autoClose: 1000,
      });
    } finally {
      setIsSubmitting(false);
      setIsConfirming(false);
    }
  };

  const clearEverything = () => {
    setCompanyDetails({ companyName: "", location: "" });
    setRows([{ id: Date.now(), department: "", numStudents: "", pocketMoney: "" }]);
    setConfirmedRows([]);
    setErrors({});
  };

  const cancelConfirmation = () => {
    setIsConfirming(false);
  };

  return (
    <div className="w-[80%]">
      {isConfirming ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Confirm Internship Postings</h2>
          <h2 className="text-sm font-semibold text-red-500 mb-4">
            Note: Rows that weren't fully filled have been left out.
          </h2>
          <table className="table-auto w-full text-left border">
            <thead>
              <tr className="bg-blue-100 bg-opacity-60">
                <th className="border px-4 py-2">Company Name</th>
                <th className="border px-4 py-2">Location</th>
                <th className="border px-4 py-2">Department</th>
                <th className="border px-4 py-2">Number of Students</th>
                <th className="border px-4 py-2">Pocket Money</th>
                
              </tr>
            </thead>
            <tbody>
              {confirmedRows.map((row, index) => (
                <tr key={index} className="bg-green-100 bg-opacity-60">
                  <td className="border px-4 py-2">{row.companyName}</td>
                  <td className="border px-4 py-2">{row.location}</td>
                  <td className="border px-4 py-2">{row.department}</td>
                  <td className="border px-4 py-2">{row.noOfStudents}</td>
                  <td className="border px-4 py-2">{row.pocketMoney ? "Yes" : "No"}</td>
                 
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-4 flex gap-4">
            <Button onClick={confirmPost} className="bg-blue-500 text-white px-4 py-2 rounded">
              Confirm
            </Button>
            <Button onClick={cancelConfirmation} className="bg-gray-500 text-white px-4 py-2 rounded">
              Back to Edit
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {/* Company Name and Location Fields */}
          <div className="flex gap-2 mb-4">
            <Input
              color="blue"
              label="Company Name"
              value={companyDetails.companyName}
              onChange={(e) => handleCompanyInputChange("companyName", e.target.value)}
            />
            <Input
              color="blue"
              label="Location"
              value={companyDetails.location}
              onChange={(e) => handleCompanyInputChange("location", e.target.value)}
            />
          </div>

          {/* Row List */}
          {rows.map((row) => (
            <div key={row.id} className="flex gap-2 mb-4">
              <Select
                label="Select Department"
                value={row.department}
                onChange={(val) => handleRowInputChange(row.id, "department", val)}
              >
                <Option value="CHEMICAL">Chemical Engineering</Option>
                <Option value="MECHANICAL">Mechanical Engineering</Option>
                <Option value="INDUSTRIAL">Industrial Engineering</Option>
                <Option value="CIVIL">Civil Engineering</Option>
                <Option value="ELECTRICAL">Electrical Engineering</Option>
                <Option value="ARCHITECTURE">Architecture</Option>
              </Select>
              {errors[row.id] && (
                <p className="text-red-500 text-xs">{errors[row.id]}</p>
              )}
              <Input
                type="number"
                color="blue"
                label="Number of Students"
                value={row.numStudents}
                onChange={(e) => handleRowInputChange(row.id, "numStudents", e.target.value)}
              />
              <Select
                label="Pocket Money?"
                value={row.pocketMoney}
                onChange={(val) => handleRowInputChange(row.id, "pocketMoney", val)}
              >
                <Option value="true">Yes</Option>
                <Option value="false">No</Option>
              </Select>
              <button
                onClick={() => removeRow(row.id)}
                className="bg-red-500 text-white rounded-full px-2"
              >
                X
              </button>
            </div>
          ))}

          {/* Add Row Button */}
          <div
            className="w-9 h-9 cursor-pointer hover:bg-blue-100 hover:bg-opacity-80 transition-colors text-blue-600 font-semibold flex items-center justify-center rounded-full border border-blue-400"
            onClick={addRow}
          >
            +
          </div>

          {/* Confirm Post Button */}
          <div className="mt-4">
            <Button
              onClick={postInternships}
              color="blue"
              disabled={isSubmitting}
              className="text-white px-4 py-2 rounded"
            >
              {isSubmitting ? "Sending" : "Send Form"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};


