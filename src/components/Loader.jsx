// Loader.js
import { Oval } from 'react-loader-spinner';

const Loader = ({ message = "Loading..." }) => {
  return (
    <div className="flex flex-col justify-center items-center">
      <Oval
        height={60}
        width={60}
        color="#3498db"
        ariaLabel='loading'
        wrapperStyle={{}}
        wrapperClass=''
        visible={true}
        secondaryColor="#f3f3f3"
        strokeWidth={5}
        strokeWidthSecondary={5}
      />
      <p className="mt-4 text-lg text-gray-700">{message}</p>
    </div>
  );
};

export default Loader;
