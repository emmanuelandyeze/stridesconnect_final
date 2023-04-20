import React, { useEffect, useState } from 'react';
import { AiOutlineLogout } from 'react-icons/ai';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';

import {
    userCreatedCommunityQuery,
	userCreatedPinsQuery,
	userQuery,
	userSavedCommunityQuery,
	userSavedPinsQuery,
} from '../utils/data';
import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import Spinner from './Spinner';
import CommunityLayout from './CommunityLayout';
import { BsPeople } from 'react-icons/bs';

const activeBtnStyles =
	'bg-purple-500 text-white font-bold p-2 rounded-full w-20 outline-none';
const notActiveBtnStyles =
	'bg-primary mr-4 text-black font-bold p-2 rounded-full w-20 outline-none';

const MyCommunity = () => {
	const [user, setUser] = useState();
	const [communities, setCommunities] = useState();
	const [text, setText] = useState('Created');
	const [activeBtn, setActiveBtn] = useState('created');
	const navigate = useNavigate();
	const { userId } = useParams();

	const User =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	useEffect(() => {
		const query = userQuery(userId);
		client.fetch(query).then((data) => {
			setUser(data[0]);
		});
	}, [userId]);

	useEffect(() => {
		if (text === 'Created') {
			const createdCommunityQuery = userCreatedCommunityQuery(userId);

			client.fetch(createdCommunityQuery).then((data) => {
				setCommunities(data);
			});
		} else {
			const savedCommunityQuery = userSavedCommunityQuery(userId);

			client.fetch(savedCommunityQuery).then((data) => {
				setCommunities(data);
			});
		}
	}, [text, userId]);

	if (!user) return <Spinner message="Loading your communities" />;

	return (
		<div className="relative pb-2 h-full justify-center items-center">
			<div className="flex flex-col pb-5 md:max-w-2xl max-w-sm mx-auto">
				<div className="relative flex flex-col mb-7">
					<div className="flex flex-col justify-center items-center">
						{/* <img
							className=" w-full h-370 2xl:h-510 shadow-lg object-cover"
							src="https://source.unsplash.com/1600x900/?nature,photography,technology"
							alt="user-pic"
						/> */}
						{/* <img
							className="rounded-full mt-10 shadow-xl object-cover"
							src={user?.image}
							alt="user-pic"
						/> */}
					</div>
					{/* <h1 className="font-bold text-3xl text-center mt-3">
						{user.userName}
					</h1> */}
				</div>
				<div className="text-center mb-7">
					<button
						type="button"
						onClick={(e) => {
							setText(e.target.textContent);
							setActiveBtn('created');
						}}
						className={`${
							activeBtn === 'created'
								? activeBtnStyles
								: notActiveBtnStyles
						}`}
					>
						Created
					</button>
					<button
						type="button"
						onClick={(e) => {
							setText(e.target.textContent);
							setActiveBtn('saved');
						}}
						className={`${
							activeBtn === 'saved'
								? activeBtnStyles
								: notActiveBtnStyles
						}`}
					>
						Joined
					</button>
				</div>

				<div className="px-1 md:mx-auto">
					<div className="hidden md:block">
						<CommunityLayout communities={communities} />
					</div>
					<div className="block md:hidden">
						{communities?.map((community) => (
							<div onClick={() => navigate(`/communities/${community?._id}`)} className="">
								<div
									className="flex flex-row items-center my-2"
									style={{
										borderBottom:
											'.5px solid rgb(229 231 235)',
                                    }}
								>
									<img
										src={urlFor(community?.image)
											.width(250)
											.url()}
										className="block rounded-lg"
										style={{
											height: '4rem',
											width: '4rem',
											objectFit: 'cover',
										}}
										alt=""
									/>
									<div className="ml-2 py-2">
										<h1 className="font-bold text-slate-700 text-lg">
											{community.title}
										</h1>
										{community?.postedBy._id !== userId ? (
											<button
												type="button"
												className="flex flex-row items-center bg-gray-200 mt-1 opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
											>
												{community?.save?.length}{' '}
												<BsPeople className="ml-2" />
											</button>
										) : (
											<button
												type="button"
												className="flex flex-row items-center bg-gray-100 mt-1 opacity-100 text-dark font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
											>
												Admin
											</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>

				{communities?.length === 0 && (
					<div className="flex justify-center font-bold items-center w-full text-1xl mt-2">
						You don't belong to any community
					</div>
				)}
			</div>
		</div>
	);
};

export default MyCommunity;
