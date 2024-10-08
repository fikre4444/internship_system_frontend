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
      <AvatarAndBadge name="MM"/>
      <CustomBadge>
        <div className="bg-blue-gray-400">Sollo</div>
      </CustomBadge>
    </div>
  )
}

const AvatarAndBadge = ({name}) => {
  return (
    <div className="m-2 ml-4">
      <div className="w-10 h-10 bg-blue-500 flex relative justify-center items-center rounded-full">
        <p className="text-white font-bold text-lg capitalize tracking-widest">{name ? name : "FT"}</p>
        <div className="bg-green-800 w-3 h-3 rounded-full border-2 border-white absolute bottom-0 right-0"></div>
      </div>
    </div>
  )
}

const CustomBadge = ({children}) => {
  return (
    <div className="inline-block relative">
        {children}
        <div className="bg-green-800 w-3 h-3 rounded-full border-2 border-white absolute bottom-[-6px] right-[-6px]"></div>
    </div>
  )
}

export default StudentPage1;
