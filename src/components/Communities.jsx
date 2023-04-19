import React, { useState, useEffect } from 'react';
import { NavLink, useParams } from 'react-router-dom';

import { client } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import {
	categories,
	communityQuery,
	feedQuery,
	myFeedQuery,
	searchQuery,
	userQuery,
} from '../utils/data';
import Masonry from 'react-masonry-css';
import CommunityLayout from './CommunityLayout';

const isNotActiveStyle =
	'flex  items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
	'flex  items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const breakpointObj = {
	default: 3,
	// 3000: 6,
	// 2000: 5,
	// 1200: 3,
	// 1000: 2,
	// 500: 2
};

const Communities = () => {
	const [loading, setLoading] = useState(false);
	const [communities, setCommunities] = useState(null);
	const { categoryId } = useParams();
	const [user, setUser] = useState(null);

	//   const User =
	// 		localStorage.getItem('user') !== 'undefined'
	// 			? JSON.parse(localStorage.getItem('user'))
	// 			: localStorage.clear();

	//   useEffect(() => {
	// 		const query = userQuery(User?.sub);
	// 		client.fetch(query).then((data) => {
	// 			setUser(data[0]);
	// 		});
	//   }, [User]);

	useEffect(() => {
		setLoading(true);
		if (categoryId) {
			const query = searchQuery(categoryId);
			client.fetch(query).then((data) => {
				setCommunities(data);
				setLoading(false);
			});
		} else {
			client.fetch(communityQuery).then((data) => {
				setCommunities(data);
				setLoading(false);
			});
		}
	}, [categoryId]);

	if (loading)
		return (
			<Spinner message="We are adding new communities to your feed!" />
		);
	if (!communities?.length) return <h2>No communities available</h2>;
	return (
		<div className="flex flex-row max-w-4xl mx-auto">
			{communities && <CommunityLayout communities={communities} />}
			<div className="hidden md:block md:ml-5">
				{/* <h3 className="mt-5 px-5 text-base md:text-md font-bold">
					Discover Categories
				</h3> */}
				{/* <Masonry
					className="flex animate-slide-fwd place-content-center mt-4"
					breakpointCols={breakpointObj}
				>
					{categories
						.slice(0, categories.length - 1)
						.map((category) => (
							<NavLink
								to={`/category/${category.name}`}
								className={({ isActive }) =>
									isActive
										? isActiveStyle
										: isNotActiveStyle
								}
								key={category.name}
							>
								{category.name}
							</NavLink>
						))}
				</Masonry> */}
			</div>
		</div>
	);
};

export default Communities;
