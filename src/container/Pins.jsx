import React, { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import {Navbar, Feed, PinDetail, CreatePin, Search} from '../components'
import CreateCommunity from '../components/CreateCommunity'
import Communities from '../components/Communities'
import CommunityDetail from '../components/CommunityDetail'
import MyCommunity from '../components/MyCommunity'
import SingleThread from '../components/SingleThread'

const Pins = ({user}) => {
  const [searchTerm, setSearchTerm] = useState('') 
  return (
		<div style={{}} className=" md:px-3 rounded-xl">
			<div className="bg-white mx-auto hidden">
				<Navbar
					searchTerm={searchTerm}
					setSearchTerm={setSearchTerm}
					user={user}
				/>
			</div>
			<div className="h-full pt-18">
				<Routes>
					<Route path="/" element={<Feed />} />
					<Route
						path="/community"
						element={<Communities />}
					/>
					<Route
						path="/comm/:userId"
						element={<MyCommunity />}
					/>
					<Route
						path="/communities/:communityId"
						element={<CommunityDetail user={user} />}
					/>

					<Route
						path="/category/:categoryId"
						element={<Feed />}
					/>
					<Route
						path="/thread/:threadId"
						element={<SingleThread user={user} />}
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
						path="/create-community"
						element={<CreateCommunity user={user} />}
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