import React, { useEffect, useState } from 'react';

import MasonryLayout from './MasonryLayout';
import { client } from '../client';
import { categories, feedQuery, searchQuery, userQuery } from '../utils/data';
import Spinner from './Spinner';
import Masonry from 'react-masonry-css';
import { NavLink, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import { IoMdSearch } from 'react-icons/io';

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

const Search = () => {
	const [pins, setPins] = useState();
	const [loading, setLoading] = useState(false);
	const [user, setUser] = useState();
	const navigate = useNavigate()
	const [searchTerm, setSearchTerm] = useState('')

	const User =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	useEffect(() => {
		const query = userQuery(User.sub);
		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [User]);
	

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
			<div className='fixed w-full block' style={{zIndex: 1}}>
				<div className="flex justify-start items-center w-full border-none">
					<label class="relative block w-full">
						<span class="sr-only">Search</span>
						<span class="absolute inset-y-0 left-0 flex items-center pl-2">
							<IoMdSearch
								fontSize={21}
								className="ml-1 bg-white"
							/>
						</span>
						<input
							class="placeholder:italic w-full placeholder:text-slate-400 block bg-white border outline-none py-3.5 pl-9 pr-3 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-gray-500 focus:ring-1 sm:text-sm"
							type="text"
							onChange={(e) =>
								setSearchTerm(e.target.value)
							}
							placeholder="Search stories or categories..."
							value={searchTerm}
							onFocus={() => navigate('/search')}
						/>
					</label>
				</div>
			</div>
			{loading && <Spinner message="Searching stories" />}
			{pins?.length !== 0 && (
				<div className="flex flex-row max-w-4xl pt-10 mx-auto">
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
