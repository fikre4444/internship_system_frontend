const NoRole = () => {
  return (
    <div>
      <div className="flex justify-center mx-auto my-8">
        <h1 className="text-lg md:text-2xl lg:text-3xl p-6 mx-2 font-bold bg-blue-300 bg-opacity-20 rounded-xl shadow-lg text-blue-gray-700 w-auto lg:w-[80%] inline-block">
          Hello User, At this moment you don't have a Role assigned, please contact the administrator.
        </h1>
      </div>
    </div>
  );
}

export default NoRole;
