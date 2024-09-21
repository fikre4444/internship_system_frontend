export const validateFirstName = (firstName) => {
  let error = '';
  let valid = false;

  if (!firstName) {
    error = 'First name is required.';
  }
  else if (firstName.length < 2 || firstName.length > 50) {
    error = 'First name must be between 2 and 50 characters.';
  }
  else if (!/^[a-zA-Z]+$/.test(firstName)) {
    error = 'First name must contain only letters.';
  }

  if(error === '') valid = true;

  return { valid, error };
};

export const validateLastName = (lastName) => {
  let error = '';
  let valid = false;

  if (!lastName) { 
    error = 'Last name is required.'; 
  }
  else if (lastName.length < 2 || lastName.length > 50) {
    error = 'Last name must be between 2 and 50 characters.';
  }
  else if (!/^[a-zA-Z]+$/.test(lastName)) {
    error = 'Last name must contain only letters.';
  }

  if(error === '') valid = true;

  return { valid, error };
}

export const validateUsername = (username) => {
  let error = '';
  let valid = false;

  const minLength = 3;
  const maxLength = 28;
  const usernameRegex = /^[a-zA-Z][a-zA-Z0-9_/@]*$/

  if (!username) { 
    error = 'Username is required.'; 
  }
  else if (username.length < minLength || username.length > maxLength) {
    error = `Username must be between ${minLength} and ${maxLength} characters long.`;
  }
  else if (!usernameRegex.test(username)){
    error = 'Username must start with a letter and can only contain letters, numbers, underscores, "/" and "@".';
  }

  if(error === '') valid = true;

  return { valid, error };
}


export const validateEmail = (email) => {
  let error = '';
  let valid = false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if(email.trim() === ''){
    error = '';
  } 
  else if (!emailRegex.test(email)) {
    error = 'Please enter a valid email address (e.g., user@example.com).';
  }
  
  if(error === '') valid = true;

  return {valid, error};
}

export const validateDepartment = (department) => { 
  let error = '';
  let valid = false;

  if(!department){
    error = "Department is Required";
  }

  if(error === '') valid = true;

  return { valid, error }
}

export const validateStream = (stream) => {
  let error = '';
  let valid = false;

  const streamRegex = /^[a-zA-Z0-9\s]*$/;

  if(stream.trim() === ''){
    error = '';
  } 
  else if (!streamRegex.test(stream)) {
    error = 'Stream can only contain letters, numbers, and spaces.';
  }
  
  if(error === '') valid = true;

  return {valid, error};
}

export const validateCourseLoad = (courseLoad) => {
  let error = '';
  let valid = false;

  if(!courseLoad){
    error = "Course load is Required";
  }

  if(error === '') valid = true;

  return { valid, error }

}

export const validateGrade = (grade) => {
  let error = '';
  let valid = false;

  if(!grade){
    error = "Grade is Required";
  }

  if(error === '') valid = true;

  return { valid, error }

}



