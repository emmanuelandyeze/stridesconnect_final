import React from 'react'
import Masonry from 'react-masonry-css'
import Pin from './Pin'


const breakpointObj = {
    default: 1,
    // 3000: 6,
    // 2000: 5,
    // 1200: 3,
    // 1000: 2,
    // 500: 2
}

const MasonryLayout = ({pins}) => {
  return (
		<Masonry
			className="flex animate-slide-fwd place-content-center"
			breakpointCols={breakpointObj}
		>
			{pins?.map((pin) => (
				<div
					className="m-2"
					style={{
						borderBottom: '.5px solid rgb(229 231 235)',
					}}
				>
					<Pin key={pin._id} pin={pin} className="w-max" />
				</div>
			))}
		</Masonry>
	);
}

export default MasonryLayout