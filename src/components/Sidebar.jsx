import React from 'react'
import { Link, NavLink } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri'
import { MdExplore, MdOutlinePeopleAlt } from 'react-icons/md'
import { BiCalendarEvent } from 'react-icons/bi'
import { categories } from '../utils/data';

const isNotActiveStyle = 'flex  items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const isActiveStyle =
	'flex  items-center px-5 text-purple-950 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false)
  }
  return (
		<div
			style={{
				borderRight: '.5px solid #9CBED6',
				zIndex: 2000,
			}}
			className="flex flex-col justify-between bg-white h-full overflow-y-scroll min-w-210 hide-scrollbar"
		>
			<div className="flex flex-col">
				<Link
					to={'/'}
					className="flex px-5 gap-2 my-6 pt-1 w-190 items-center"
					onClick={handleCloseSidebar}
				>
					<h1 className="font-extrabold text-2xl text-purple-950">
						Strides Connect
					</h1>
				</Link>
				<div className="flex flex-col gap-10 mt-8">
					<NavLink
						to={'/'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<RiHomeFill size={25} />
						Home
					</NavLink>
					<NavLink
						to={'/search'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
						key={'explore'}
					>
						<MdExplore size={25} />
						Explore
					</NavLink>
					<NavLink
						to={'/events'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<BiCalendarEvent size={25} />
						Events
					</NavLink>
					<NavLink
						to={'/community'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<MdOutlinePeopleAlt size={25} />
						Community
					</NavLink>
				</div>
			</div>
			{user && (
				<Link
					to={`profile/${user._id}`}
					className="flex my-5 mb-3 gap-2 items-center bg-white rounded-lg mx-3"
				>
					<img
						src={user?.image}
						alt=""
						className="w-10 h-10 rounded-full"
					/>
					<p>{user?.userName}</p>
				</Link>
			)}
		</div>
	);
}

export default Sidebar