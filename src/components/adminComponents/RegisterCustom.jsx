import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { Button, Input, Option, Select, Typography } from "@material-tailwind/react";
import { Radio } from "@material-tailwind/react";
import { useState } from 'react';
import { validateCourseLoad, validateDepartment, validateEmail, validateFirstName, validateGrade, validateLastName, validateStream, validateUsername } from "../../utils/formatting";
import { useRef } from "react";
import axios from 'axios';
import AccountsTable from "../AccountsTable";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RegisterCustom = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registeredUser, setRegisteredUser] = useState([]);
  const [gotResponse, setGotResponse] = useState(false);
  const TABLE_HEAD = ["Member", "Username", "Department", "Status", "Gender"];


  //registration refs
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const usernameRef = useRef(null);
  const emailRef = useRef(null);
  const departmentRef = useRef(null);
  const streamRef = useRef(null);
  const gradeRef = useRef(null);
  const courseLoadRef = useRef(null);


  //registration state
  const [typeUser, setTypeUser] = useState('STUDENT');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [department, setDepartment] = useState('');
  const [gender, setGender] = useState('MALE');
  const [stream, setStream] = useState('');
  const [grade, setGrade] = useState('');
  const [courseLoad, setCourseLoad] = useState('');
  const [errors, setErrors] = useState({
    firstName: '', lastName: '', username: '', email: '', department: '',
    stream: '', grade: '', courseLoad: ''
  });

  const handleTypeUserChange = (newTypeUser) => {
    setTypeUser(newTypeUser);
    if(newTypeUser === 'STAFF'){
      setGrade('');
      setStream('');
    } else if(newTypeUser === 'STUDENT'){
      setCourseLoad('');
    }
  }

  const handleFirstNameChange = (e) => {
    setFirstName(e.target.value);
    setErrors({...errors, firstName: ''})
  }

  const handleLastNameChange = (e) => {
    setLastName(e.target.value);
    setErrors({...errors, lastName: ''})
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setErrors({...errors, username: ''});
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setErrors({...errors, email: ''});
  }

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setErrors({...errors, department: ''});
  }


  const handleGradeChange = (e) => {
    let value = e.target.value;
    if(value === '') { 
      setGrade('');
      return;
    } 
    const twoDecimalDigitsRegEx = /^[0-9]*(\.[0-9]{0,2})?$/;
    if(twoDecimalDigitsRegEx.test(value)){
      const numValue = parseFloat(value);
      if(numValue >= 0 && numValue <= 4){
        setGrade(value);
        setErrors({...errors, grade: ''});
      }
    }
  }

  const handleCourseLoadChange = (e) => {
    const value = e.target.value;
    if(value === ''){
      setCourseLoad('');
      return;
    }
    const twoDecimalDigitsRegEx = /^[0-9]*(\.[0-9]{0,2})?$/;
    if(value === '' || twoDecimalDigitsRegEx.test(value)){
      const numValue = parseFloat(value);
      if(numValue >= 0 && numValue <= 12){
        setCourseLoad(value);
        setErrors({...errors, courseLoad: ''});
      }
    }
  }

  const handleStreamChange = (e) => {
    setStream(e.target.value);
    setErrors({...errors, stream: ''});
  }

  const validateInputs = () => {
    const firstNameValidation = validateFirstName(firstName);
    if(!firstNameValidation.valid){ 
      setErrors({ ...errors, firstName: firstNameValidation.error })
      firstNameRef.current.focus();
      return false; 
    }
    const lastNameValidation = validateLastName(lastName);
    if(!lastNameValidation.valid){ 
      setErrors({...errors, lastName: lastNameValidation.error });
      lastNameRef.current.focus();
      return false; 
    }
    const usernameValidation = validateUsername(username);
    if(!usernameValidation.valid){
      setErrors({...errors, username: usernameValidation.error});
      usernameRef.current.focus();
      return false;
    }
    const emailValidation = validateEmail(email);
    if(!emailValidation.valid){
      setErrors({...errors, email: emailValidation.error});
      emailRef.current.focus();
      return false;
    }
    const departmentValidation = validateDepartment(department);
    if(!departmentValidation.valid){
      setErrors({...errors, department: departmentValidation.error});
      departmentRef.current.focus();
      return false;
    }
    if(typeUser === 'STUDENT'){
      const streamValidation = validateStream(stream);
      if(!streamValidation.valid){
        setErrors({...errors, stream: streamValidation.error});
        streamRef.current.focus();
        return false;
      }
      const gradeValidation = validateGrade(grade);
      if(!gradeValidation.valid){
        setErrors({...errors, grade: gradeValidation.error});
        gradeRef.current.focus();
        return false;
      }
    }
    if(typeUser === 'STAFF'){
      const courseLoadValidation = validateCourseLoad(courseLoad);
      if(!courseLoadValidation.valid){
        setErrors({...errors, courseLoad: courseLoadValidation.error});
        courseLoadRef.current.focus();
        return false;
      }
    }

    return true;
  }

  const getRequestObject = () => {
    const trimmedEmail = email.trim();
    let requestObject = {
      typeUser, firstName, lastName, username, 
      email: trimmedEmail, department, gender,
    };
    if(typeUser === 'STUDENT'){
      const trimmedStream = stream.trim();
      requestObject.stream = trimmedStream;
      requestObject.grade = grade;
    } else if (typeUser === 'STAFF'){
      requestObject.courseLoad = courseLoad;
    }
    return requestObject;
  }

  const handleCustomRegister = async () => {
    if(!validateInputs()){  //if the input are not valid
      return;
    }

    setErrors({
      firstName: '', lastName: '', username: '', email: '', department: '',
      stream: '', grade: '', courseLoad: ''
    });

    const requestObject = getRequestObject();

    try{
      setIsSubmitting(true);
      const response = await axios.post('/api/admin/registerCustom', requestObject, {
        timeout: 10000  //waits ten seconds
      });
      console.log("we got the response and it is");
      console.log(response.data);
      const data = response.data;
      if(!data.errorResponse && !data.incorrectBody){
        if(typeUser === 'STUDENT' && data.registeredStudents != null) {
          console.log(data.registeredStudents)
          setGotResponse(true);
          setRegisteredUser(data.registeredStudents)
        } else if( typeUser === 'STAFF' && data.registeredStaffs != null) {
          console.log(data.registeredStaffs)
          setGotResponse(true);
          setRegisteredUser(data.registeredStaffs)
        } else if( data.existingStudents != null){
          toast.error(() => <div>
            A user by that username already exists. Either change the username or check the user.
            <Button className="bg-red-500">
              Go to user
            </Button>
          </div>, {
            position: "top-center",
            style: {
              backgroundColor: '#fee'
            }
          });
        } else if( data.existingStaffs != null){
          toast.error(() => <div>
            A user by that username already exists. Either change the username or check the user.
            <Button className="bg-red-500">
              Go to user
            </Button>
          </div>, {
            position: "top-center",
            pauseOnFocusLoss: false,
            style: {
              backgroundColor: '#fee'
            }
          });
        } else {
          toast.error("An Unknown error has occured. Please Try again later.")
        }
      }
    }catch(e){
      toast.error("An Unknown error has occured. Please Try again later.")
      console.log(e);
    }finally {
      setIsSubmitting(false);
    }    
  }

  const handleReturnToRegistration = () => {
    setGotResponse(false);
    setRegisteredUser([])
    clearStates();
  }

  const clearStates = () => {
    setTypeUser('STUDENT');
    setFirstName('');
    setLastName('');
    setUsername('');
    setEmail('');
    setDepartment('');
    setGender('MALE');
    setStream('');
    setGrade('');
    setCourseLoad('');
    setErrors({
      firstName: '', lastName: '', username: '', email: '', department: '',
      stream: '', grade: '', courseLoad: ''
    });
  }




  return (
    <div className="m-4"> {/* for custom registration*/}
    { !gotResponse ?
      <>
        <ToastContainer />
        <h1 className="text-xl text-blue-gray-700 font-extrabold">Custom Registration</h1>
        <div className="">
          <h3 className="text-md text-gray-800 font-extrabold">Type Of User</h3>
          <div className="flex gap-10">
            <Radio name="typeUser" checked={typeUser === 'STUDENT'} 
              label="Student" onChange={() => handleTypeUserChange('STUDENT')}
            />
            <Radio name="typeUser" checked={typeUser === 'STAFF' } 
              label="Staff" onChange={() => handleTypeUserChange('STAFF')}
            />
          </div>
        </div>
        <div className="flex flex-wrap gap-9">
          <div> {/* column 1 */}
            <div className="">
              <h3 className="text-md text-gray-800 font-extrabold">First Name</h3>
              <div className="flex w-72 flex-col gap-2 m-2 my-4">
                <Input
                  color="blue" label="Input First Name" value={firstName} 
                  onChange={handleFirstNameChange}
                  inputRef={firstNameRef}
                />
                {errors.firstName && <span className="text-red-500 m-0 p-0 text-sm">{errors.firstName}</span>}
              </div>
            </div>
            <div className="">
              <h3 className="text-md text-gray-800 font-extrabold">Last Name</h3>
              <div className="flex w-72 flex-col gap-2 m-2 my-4">
                <Input
                  color="blue" label="Input Last Name" value={lastName}
                  onChange={handleLastNameChange}
                  inputRef = {lastNameRef}
                />
                {errors.lastName && <span className="text-red-500 m-0 p-0 text-sm">{errors.lastName}</span>}
              </div>
            </div>
            <div className="">
              <h3 className="text-md text-gray-800 font-extrabold">Username</h3>
              <div className="flex w-72 flex-col gap-2 m-2 my-4">
                <Input
                  color="blue" label="Input Username" value={username}
                  onChange={handleUsernameChange}
                  inputRef = {usernameRef}
                />
                {errors.username && <span className="text-red-500 m-0 p-0 text-sm">{errors.username}</span>}
              </div>
            </div>
            <div className="">
              <h3 className="text-md text-gray-800 font-extrabold">Email</h3>
              <div className="flex w-72 flex-col gap-2 m-2 my-4">
                <Input label="Input Email Address" icon={<EnvelopeIcon />} value={email}
                  onChange={handleEmailChange}
                  inputRef = {emailRef}
                />
                {errors.email && <span className="text-red-500 m-0 p-0 text-sm">{errors.email}</span>}
              </div>
            </div>
          </div>

          <div> {/* column 2 */}
            <div className="">
              <h3 className="text-md text-gray-800 font-extrabold">Department</h3>
              <div className="w-72 m-2">
                <div className="relative group my-4">
                  <Select ref={departmentRef}  label="Select department" value={department} onChange={handleDepartmentChange}>
                    <Option value="Chemical Engineering">Chemical Engineering</Option>
                    <Option value="Mechanical Engineering">Mechanical Engineering</Option>
                    <Option value="Industrial Engineering">Industrial Engineering</Option>
                    <Option value="Civil Engineering">Civil Engineering</Option>
                    <Option value="Electrical Engineering">Electrical Engineering</Option>
                  </Select>
                </div>
                {errors.department && <span className="text-red-500 m-0 p-0 text-sm">{errors.department}</span>}
              </div>
            </div>
            <div className="my-5">
              <h3 className="text-md text-gray-800 font-extrabold">Gender</h3>
              <div className="flex gap-10 m-[5px]">
                <Radio name="gender" label="Male" 
                  checked={gender === 'MALE'} onChange={() => setGender('MALE')}
                />
                <Radio name="gender" label="Female" 
                  checked={gender === 'FEMALE'} onChange={() => setGender('FEMALE')}
                />
              </div>
            </div>
            { typeUser === 'STUDENT' &&
              <div>
                <div className="">
                  <h3 className="text-md text-gray-800 font-extrabold">Stream (For Student Only)</h3>
                  <div className="flex w-72 flex-col gap-2 m-2 my-4">
                    <Input
                      color="blue" label="Input Stream of Student" value={stream}
                      onChange={handleStreamChange}
                      inputRef={streamRef}
                    />
                    {errors.stream && <span className="text-red-500 m-0 p-0 text-sm">{errors.stream}</span>}
                  </div>
                </div>
                <div>
                  <h3 className="text-md text-gray-800 font-extrabold">Grade (For Student Only)</h3>
                  <div className="flex w-72 flex-col gap-2 m-2 my-4">
                    <Input label="Input Grade of Student" placeholder="Input value between 0.00 and 4.00" type="number" 
                      value={grade} step="0.01" onChange={handleGradeChange}
                      inputRef={gradeRef}
                    />
                    {errors.grade && <span className="text-red-500 m-0 p-0 text-sm">{errors.grade}</span>}
                  </div>
                </div>
              </div>
            }
            { typeUser === 'STAFF' &&
              <div>
                <div>
                  <h3 className="text-md text-gray-800 font-extrabold">Course Load (For Staff Only)</h3>
                  <div className="flex w-72 flex-col gap-2 m-2 my-4">
                    <Input label="Input Course Load" type="number" placeholder="Input a value between 0 and 12"
                      value={courseLoad} onChange={handleCourseLoadChange}
                      inputRef={courseLoadRef}
                    />
                    {errors.courseLoad && <span className="text-red-500 m-0 p-0 text-sm">{errors.courseLoad}</span>}
                  </div>
                </div>
              </div>
            }
            
          </div>
        </div>
        <div className="m-2">
          <div className="flex w-max gap-4 m-2 mt-6">
            <Button loading={isSubmitting} onClick={handleCustomRegister} className="bg-blue-gray-500" >
              {!isSubmitting ? <>Register User</> : <>Registering User</>}
            </Button>
          </div>
        </div>
      </>
      :
      <>
        <h1 className="text-xl font-bold text-green-500">Successfully Registered!</h1>
        <Button onClick={handleReturnToRegistration} className="bg-blue-gray-500" >
            Back to Custom Registration
        </Button>
        <AccountsTable TABLE_HEAD={TABLE_HEAD} TABLE_ROWS={registeredUser} />

        
      </>
    }
    </div>
  );
}

export default RegisterCustom;
