import React from 'react'
import { Rings} from 'react-loader-spinner'

const Spinner = ({message}) => {

  return (
    <div className='flex flex-col justify-center items-center w-full h-4 mt-3'>
        <Rings 
            type='Puff'
            color="#00BFFF"
            height={80}
            width = {250}
            className="m-5"
        />
       
        <p className='text-lg text-center px-2'>{message} </p>
       
    </div>
  )
}

export default Spinner