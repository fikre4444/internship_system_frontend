const IMSLogo = ({className}) => {
  return (
    <div className={"flex flex-col items-center w-16 bg-blue-gray-100 rounded-full "+className}>
      <CircularLetter className="relative top-[5px]" letter={'I'} />
      <div className="flex relative top-[-5px]">
        <CircularLetter className="relative left-1" letter={'M'} />
        <CircularLetter className="relative left-[-4px]" letter={'S'} />
      </div>
    </div>
  )
}

const CircularLetter = ({ letter, className }) => {
  return (
    <div 
      className={"bg-blue-600 bg-opacity-80 rounded-full p-2 w-8 h-8 flex justify-center items-center text-white text-xl font-extrabold uppercase "+className}>
      <p>{letter}</p>
    </div>
  )
}

export default IMSLogo;