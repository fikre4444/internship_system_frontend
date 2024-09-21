import { useState } from 'react'


const AdminPage2 = () => {
  const [key, setKey] = useState(0);
  const [another, setAnother] = useState("Empty");


  const displayThings = () => {
    console.log("key is ", key);
    console.log("another is ", another);
  }

  const doReset = () => {
    console.log("key" , key);
    setKey(prevKey => prevKey + 1)
  }

  return (
    <div key={key}>
        <button onClick={() => setAnother('ANOTHER')}>Edit another</button>
        <button onClick={() => doReset()}>Reset</button>
        <button onClick={() => displayThings()}>displayThings</button>
    </div>
  )
}

export default AdminPage2;
