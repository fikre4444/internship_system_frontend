const BigMessage = ({text}) => {
  return (
    <div className="flex justify-center mx-auto my-6">
      <h1 className="text-lg md:text-2xl lg:text-3xl font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 p-3 w-auto inline-block">
        {text}
      </h1>
    </div>
  )
}

export default BigMessage;
