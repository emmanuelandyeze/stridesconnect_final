import React from 'react'
import { Circles } from 'react-loader-spinner'

const Spinner = ({message}) => {
  return (
		<div className="flex flex-col justify-center items-center w-full mt-18">
			<Circles
				color="rgb(59 7 100)"
				height={50}
				width={200}
				className="m-5"
			/>
			<p className="text-lg text-center px-2">{message}</p>
		</div>
	);
}

export default Spinner