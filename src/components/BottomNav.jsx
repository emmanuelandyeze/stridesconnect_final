import React, {
	Fragment,
	useEffect,
	useRef,
	useState,
} from 'react';
import { Link, NavLink } from 'react-router-dom';
import { RiHomeFill } from 'react-icons/ri';
import {
	MdExplore,
	MdOutlinePeopleAlt,
	MdPersonSearch,
} from 'react-icons/md';
import { BiCalendarEvent } from 'react-icons/bi';
import { categories } from '../utils/data';
import { Dialog, Transition } from '@headlessui/react';
import { TfiWrite } from 'react-icons/tfi';
import { BsPeopleFill } from 'react-icons/bs';

const isNotActiveStyle =
	'flex  items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize';
const isActiveStyle =
	'flex  items-center px-5 text-purple-950 gap-3 font-extrabold border-black transition-all duration-200 ease-in-out capitalize';

const BottomNav = ({ closeToggle }) => {
	const user =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	// useEffect(() => {
	// 	const query = userQuery(userId);
	// 	client.fetch(query).then((data) => {
	// 		setUser(data[0]);
	// 	});
	// }, [userId]);
	const handleCloseSidebar = () => {
		if (closeToggle) closeToggle(false);
	};
	const [open, setOpen] = useState(false);

	const cancelButtonRef = useRef(null);
	return (
		<>
			<div
				style={{
					zIndex: 2000,
				}}
				className=" bg-white w-full py-4"
			>
				<div className="flex flex-row justify-between">
					<NavLink
						to={'/'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<RiHomeFill size={25} />
						{/* Home */}
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
						{/* Explore */}
					</NavLink>

					{user && (
						<NavLink
							to={`comm/${user?.sub}`}
							className={({ isActive }) =>
								isActive ? isActiveStyle : isNotActiveStyle
							}
							onClick={handleCloseSidebar}
						>
							<MdOutlinePeopleAlt size={25} />
							{/* My Communities */}
						</NavLink>
					)}
					<NavLink
						to={'/events'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<BiCalendarEvent size={25} />
						{/* Events */}
					</NavLink>
					<NavLink
						to={'/community'}
						className={({ isActive }) =>
							isActive ? isActiveStyle : isNotActiveStyle
						}
						onClick={handleCloseSidebar}
					>
						<MdPersonSearch size={25} />
						{/* Find Community */}
					</NavLink>

					{/* <button
							type="button"
							className="inline-flex justify-center w-24 mr-3 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
							onClick={() => setOpen(true)}
						>
							Create
						</button> */}
				</div>
			</div>
		</>
	);
};

export default BottomNav;
