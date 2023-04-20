import React, { useState, useRef, useEffect } from 'react'
import { HiMenu } from 'react-icons/hi'
import { AiFillCloseCircle } from 'react-icons/ai'
import {Link, Route, Routes} from 'react-router-dom'
import { Sidebar, UserProfile } from '../components'
import { client } from '../client'
import Pins from './Pins'
import { userQuery } from '../utils/data'
import { RiMenu2Fill } from 'react-icons/ri'
import BottomNav from '../components/BottomNav'
import { IoIosCreate } from 'react-icons/io';

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false)
  const [user, setUser] = useState(null)
  const scrollRef = useRef(null)

  const userInfo =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

  useEffect(() => {
    const query = userQuery(userInfo?.sub)

    client.fetch(query)
		.then((data) => {
      setUser(data[0])
      })
    
  }, [userInfo])

  useEffect(() => {
    scrollRef.current.scrollTo(0,0)
  
  }, [])
  
  return (
		<div className="flex bg-white md:flex-row flex-col h-screen transition-all duration-75 ease-out">
			<div className="hidden md:flex h-screen flex-initial">
				<Sidebar />
			</div>

			<div className="flex md:hidden flex-row">
				<div className="p-2 w-full flex flex-row justify-between items-center shadow-md h-18">
					<RiMenu2Fill
						fontSize={30}
						className="cursor-pointer"
						onClick={() => setToggleSidebar(true)}
					/>
					<Link to={'/'}>
						<h1 className="text-2xl text-purple-950 font-dark">
							Strides Connect
						</h1>
					</Link>
					{user ? (
						<Link to={`profile/${user?._id}`}>
							<img
								src={user?.image}
								alt=""
								width={40}
								className="object-contain rounded-2xl"
							/>
						</Link>
					) : (
						<div></div>
					)}
				</div>
				{toggleSidebar && (
					<div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
						<div className="absolute w-full flex justify-end items-center p-2">
							<AiFillCloseCircle
								fontSize={30}
								className="cursor-pointer"
								onClick={() => setToggleSidebar(false)}
							/>
						</div>
						{user && (
							<Sidebar
								user={user}
								closeToggle={setToggleSidebar}
							/>
						)}
					</div>
				)}
			</div>
			{/* <div>
				<button>
					<IoIosCreate />
				</button>
			</div> */}
			<div
				className="pb-2 flex-1 h-screen overflow-y-scroll"
				ref={scrollRef}
			>
				<Routes>
					<Route
						path="/profile/:userId"
						element={<UserProfile />}
					/>
					<Route
						path="/*"
						element={<Pins user={user && user} />}
					/>
				</Routes>
			</div>

			<div className="flex md:hidden fixed bottom-0 w-full">
				<BottomNav />
			</div>
		</div>
	);
}

export default Home