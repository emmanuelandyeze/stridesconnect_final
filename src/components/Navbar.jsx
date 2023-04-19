import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {IoMdAdd, IoMdSearch} from 'react-icons/io'

const Navbar = ({searchTerm, setSearchTerm, user}) => {
  const navigate = useNavigate();


  return (
		<div style={{zIndex: 1}} className="flex gap-1 bg-white md:gap-5 w-full max-w-screen-xl mx-auto pt-5 pb-7 absolute">
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
						class="placeholder:italic w-full placeholder:text-slate-400 block bg-white border border-slate-300 rounded-md py-3.5 pl-9 pr-3 shadow-sm focus:outline-none focus:border-gray-500 focus:ring-gray-500 focus:ring-1 sm:text-sm"
						type="text"
						onChange={(e) => setSearchTerm(e.target.value)}
						placeholder="Search stories or categories..."
						value={searchTerm}
						onFocus={() => navigate('/search')}
					/>
				</label>
			</div>
			<div className="flex gap-3">
				{user ? (
					<>
						<Link
							to={`profile/${user?._id}`}
							className="hidden md:block"
						>
							<img
								src={user?.image}
								alt=""
								className="w-14 h-12 rounded-lg object-cover"
							/>
						</Link>
						
					</>
				) : (
					<button
						className="bg-red-500 text-white px-3 rounded-lg py-3 font-bold"
						type="button"
						onClick={() => navigate('/login')}
					>
						Login
					</button>
				)}
			</div>
		</div>
	);
}

export default Navbar