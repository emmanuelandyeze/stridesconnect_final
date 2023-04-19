import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {Navbar, Feed, PinDetail, CreatePin, Search} from '../components'

const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('') 
  return (
		<div className=" md:px-5">
			<div className="bg-white">
				<Navbar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					user={user}
				/>
			</div>
			<div className="h-full pt-24">
				<Routes>
					<Route path="/" element={<Feed />} />
					<Route
						path="/category/:categoryId"
						element={<Feed />}
					/>
					<Route
						path="/pin/:pinId"
						element={<PinDetail user={user} />}
					/>
					<Route
						path="/create"
						element={<CreatePin user={user} />}
					/>
					<Route
						path="/search"
						element={
							<Search
								searchTerm={searchTerm}
								setSearchTerm={setSearchTerm}
							/>
						}
					/>
				</Routes>
			</div>
		</div>
	);
}

export default Pins