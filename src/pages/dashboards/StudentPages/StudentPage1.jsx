import { useState } from 'react';


const StudentPage1 = () => {
  const [ counter, setCounter ] = useState(0);

  const increment1 = () => {
    setCounter(prevCounter => prevCounter + 1) // or setCounter(prevCounter => prevCounter + 1)
    setCounter(prevCounter => prevCounter + 1) // or setCounter(prevCounter => prevCounter + 1)
  }
  const increment2 = () => {
    setCounter(counter + 1)
    setCounter(counter + 1)
  }

  return (
    <div>
      Value: {counter}
      <button className="p-2 bg-blue-500 text-xl rounded-lg block m-2" onClick={increment1}>Increment 1</button>
      <button className="p-2 bg-blue-500 text-xl rounded-lg block m-2" onClick={increment2}>Increment 2</button>
    </div>
  )
}

export default StudentPage1;
