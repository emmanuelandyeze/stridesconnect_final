import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { categories, feedQuery, searchQuery } from '../utils/data';
import Spinner from './Spinner';
import Masonry from 'react-masonry-css';
import { NavLink } from 'react-router-dom';

const isNotActiveStyle =
	'flex  items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
	'flex  items-center px-5 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';

const breakpointObj = {
	default: 2,
	// 3000: 6,
	// 2000: 5,
	// 1200: 3,
	// 1000: 2,
	// 500: 2
};

const Search = ({ searchTerm }) => {
	const [pins, setPins] = useState();
	const [loading, setLoading] = useState(false);

	useEffect(() => {
		if (searchTerm !== '') {
			setLoading(true);
			const query = searchQuery(searchTerm.toLowerCase());
			client.fetch(query).then((data) => {
				setPins(data);
				setLoading(false);
			});
		} else {
			client.fetch(feedQuery).then((data) => {
				setPins(data);
				setLoading(false);
			});
		}
	}, [searchTerm]);

	return (
		<div>
			{loading && <Spinner message="Searching stories" />}
			{pins?.length !== 0 && (
				<div className="flex flex-row max-w-4xl mx-auto">
					<MasonryLayout pins={pins} />
					<div className="hidden md:block md:ml-5">
						<h3 className="mt-5 px-5 text-base md:text-md font-bold">
							Discover Categories
						</h3>
						<Masonry
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
						</Masonry>
					</div>
				</div>
			)}
			{pins?.length === 0 &&
				searchTerm !== '' &&
				!loading && (
					<div className="mt-10 text-center text-xl ">
						No Stories Found!
					</div>
				)}
		</div>
	);
};

export default Search;
