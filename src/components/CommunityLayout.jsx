import React from 'react';
import Masonry from 'react-masonry-css';
import Community from './Community';

const breakpointObj = {
	default: 2,
	// 3000: 6,
	2000: 2,
	1200: 2,
	1000: 1,
	500: 1
};

const CommunityLayout = ({ communities }) => {
	return (
		<Masonry
			className="flex animate-slide-fwd place-content-center"
			breakpointCols={breakpointObj}
		>
			{communities?.map((community) => (
				<div
					className="m-1"
					style={{
						borderBottom: '.5px solid rgb(229 231 235)',
					}}
				>
					<Community key={community._id} community={community} className="w-max" />
				</div>
			))}
		</Masonry>
	);
};

export default CommunityLayout;
