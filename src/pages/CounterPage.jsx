import { useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement, incrementByAmount, makeActiveAndIncrementByAmount } from '../redux/slices/counterSlice';


const CounterPage = () => {
  const dispatch = useDispatch();

  const value = useSelector(state => state.counter.value);
  const status = useSelector(state => state.counter.status);

  const [ amount, setAmount ] = useState(0);
  const [ statusText, setStatusText ] = useState("");

  return (
    <div>
      <div>
        Value: {value}
      </div>
      <div>
        Status: {status}
      </div>
      <div>
        <button className="text-md p-3 block bg-blue-gray-500 w-40 rounded-md m-2 text-white"
          onClick={()=>dispatch(increment())}
        >
          Add
        </button>
        <button className="text-md p-3 block bg-blue-gray-500 w-40 rounded-md m-2 text-white"
          onClick={()=>dispatch(decrement())}
        >
          subtract
        </button>
      </div>
      <div>
        <input 
           type="number" 
           className="border-black border-2 rounded p-2 text-md" 
           value={amount}
           onChange={(e) => setAmount(e.target.value)}
        />
        <button className="text-md p-3 block bg-blue-gray-500 w-40 rounded-md m-2 text-white"
          onClick={() => dispatch(incrementByAmount(Number(amount)))}
        >
          Add by amount
        </button>
      </div>
      <div>
        <input 
           type="text" 
           className="border-black border-2 rounded p-2 text-md" 
           value={statusText}
           onChange={(e) => setStatusText(e.target.value)}
        />
        <button className="text-md p-3 block bg-blue-gray-500 w-40 rounded-md m-2 text-white"
          onClick={() => dispatch(makeActiveAndIncrementByAmount({
            amount: Number(amount),
            statusChange: statusText
          }))}
        >
          Change Status
        </button>
      </div>

    </div>
  )
}

export default CounterPage




























// import { useSelector, useDispatch } from 'react-redux'
// import { decrement, increment } from '../redux/slices/counterSlice'

// export function CounterPage() {
//   const count = useSelector(state => state.counter.value)
//   const dispatch = useDispatch()

//   return (
//     <div>
//       <div className="flex flex-col gap-4 p-5">
//         <button
//           className="p-2 bg-blue-400 text-md text-black rounded-md w-36"
//           aria-label="Increment value"
//           onClick={() => dispatch(increment())}
//         >
//           Increment
//         </button>
//         <span className="text-lg font-semibold">{count}</span>
//         <button
//           className="p-2 bg-blue-400 text-md text-black rounded-md w-36"
//           aria-label="Decrement value"
//           onClick={() => dispatch(decrement())}
//         >
//           Decrement
//         </button>
//       </div>
//     </div>
//   )
// }