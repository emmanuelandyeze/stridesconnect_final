import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { RiHomeFill } from 'react-icons/ri'
import { MdExplore, MdOutlinePeopleAlt, MdPersonSearch } from 'react-icons/md'
import { BiCalendarEvent } from 'react-icons/bi'
import { categories } from '../utils/data';
import { Dialog, Transition } from '@headlessui/react';
import { TfiWrite } from 'react-icons/tfi';
import {BsPeopleFill} from 'react-icons/bs'


const isNotActiveStyle = 'flex  items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize'
const isActiveStyle =
	'flex  items-center px-5 text-purple-950 gap-3 font-extrabold border-r-2 border-black transition-all duration-200 ease-in-out capitalize';


const Sidebar = ({ closeToggle }) => {
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
    if (closeToggle) closeToggle(false)
	}
	const [open, setOpen] = useState(false);

	const cancelButtonRef = useRef(null);
	const navigate = useNavigate()
	return (
		<>
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
						{user && (
							<>
								<NavLink
									to={'/search'}
									className={({ isActive }) =>
										isActive
											? isActiveStyle
											: isNotActiveStyle
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
										isActive
											? isActiveStyle
											: isNotActiveStyle
									}
									onClick={handleCloseSidebar}
								>
									<BiCalendarEvent size={25} />
									Events
								</NavLink>
							</>
						)}

						{user && (
							<NavLink
								to={`comm/${user?.sub}`}
								className={({ isActive }) =>
									isActive
										? isActiveStyle
										: isNotActiveStyle
								}
								onClick={handleCloseSidebar}
							>
								<MdOutlinePeopleAlt size={25} />
								My Communities
							</NavLink>
						)}
						<NavLink
							to={'/community'}
							className={({ isActive }) =>
								isActive ? isActiveStyle : isNotActiveStyle
							}
							onClick={handleCloseSidebar}
						>
							<MdPersonSearch size={25} />
							Find Community
						</NavLink>

						{user ? (
							<button
								type="button"
								className="inline-flex justify-center w-24 mr-3 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
								onClick={() => setOpen(true)}
							>
								Create
							</button>
						) : (
							<button
								type="button"
								className="inline-flex justify-center w-24 mr-3 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
								onClick={() => navigate('/login')}
							>
								Login
							</button>
						)}
					</div>
				</div>
				{user && (
					<>
						<Link
							to={`profile/${user?.sub}`}
							className="flex my-5 mb-3 gap-2 items-center bg-white rounded-lg mx-3"
						>
							<img
								src={user?.picture}
								alt=""
								className="w-10 h-10 rounded-full"
							/>
							<p>{user?.name}</p>
						</Link>
					</>
				)}
			</div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					initialFocus={cancelButtonRef}
					onClose={setOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed inset-0 z-10 overflow-y-auto">
						<div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
									<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
										<div className="sm:flex sm:items-start">
											<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
												<Dialog.Title
													as="h3"
													className="text-base font-semibold leading-6 text-gray-900"
												>
													Publishing Room
												</Dialog.Title>
												<div className="mt-2">
													<div className="text-center">
														<Link
															to={`/create`}
															onClick={() => setOpen(false)}
															className="flex flex-row my-5 items-center cursor-pointer"
														>
															<div className="bg-purple-500 mr-2 text-white rounded-lg w-5 h-5 md:w-7 md:h-7 flex justify-center items-center">
																<TfiWrite size={15} />
															</div>
															<p>Publish Story</p>
														</Link>
														<Link
															to={`/create-community`}
															onClick={() => setOpen(false)}
															className="flex flex-row my-5 items-center cursor-pointer"
														>
															<div className="bg-purple-500 mr-2 text-white rounded-lg w-5 h-5 md:w-7 md:h-7 flex justify-center items-center">
																<BsPeopleFill size={15} />
															</div>
															<p>Create New Community</p>
														</Link>
													</div>
												</div>
											</div>
										</div>
									</div>
									<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
										<button
											type="button"
											className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
											onClick={() => setOpen(false)}
											ref={cancelButtonRef}
										>
											Cancel
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</>
	);
}

export default Sidebar