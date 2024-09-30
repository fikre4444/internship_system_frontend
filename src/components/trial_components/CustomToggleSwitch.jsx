import { useState, useRef } from 'react';

const CustomToggleSwitch = () => {

  const [ start, setStart ] = useState(true);
  const switchRef = useRef(null);
  const switchContainerRef = useRef(null);

  const handleSwitch = () => {
    const switchButton = switchRef.current;
    const switchContainer = switchContainerRef.current
    let toBeAdded = [];
    let toBeRemoved = [];
    if(start){
      toBeAdded = ['ml-[24px]', 'bg-gray-800'];
      toBeRemoved = ['ml-[2px]', 'bg-gray-500'];  
    } else {
      toBeRemoved = ['ml-[24px]', 'bg-gray-800'];
      toBeAdded = ['ml-[2px]', 'bg-gray-500']; 
    }
    switchButton.classList.replace(toBeRemoved[0], toBeAdded[0]);
    switchContainer.classList.replace(toBeRemoved[1], toBeAdded[1]);
    setStart(prevStart => !prevStart);
  }

  return (
    <div>
      <div ref={switchContainerRef} onClick={handleSwitch} className="bg-gray-500 w-12 h-6 rounded-full transition-all duration-200 border border-black border-opacity-50 cursor-pointer">
        <div ref={switchRef} className="bg-white w-5 h-5 mt-[1px] rounded-full transition-all ease-in-out duration-300 ml-[2px]">
        </div>
      </div>
    </div>
  );
}

export default CustomToggleSwitch;
