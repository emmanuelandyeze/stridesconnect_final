import React, { useState } from 'react';
import { urlFor, client } from '../client';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { MdDownloadForOffline } from 'react-icons/md';
import { AiTwotoneDelete } from 'react-icons/ai';
import { fetchUser } from '../utils/fetchUser';
import { BsPeople } from 'react-icons/bs';

const Community = ({
	community: {
		postedBy,
		image,
		_id,
		destination,
		save,
		title,
		about,
	},
}) => {
	const [postHovered, setPostHovered] = useState(false);
	const [savingPost, setSavingPost] = useState(false);
	const navigate = useNavigate();

	const user = fetchUser();

	const alreadySaved = !!save?.filter(
		(item) => item?.postedBy?._id === user?.sub,
	)?.length;

	const savePin = (id) => {
		if (!alreadySaved) {
			setSavingPost(true);
			client
				.patch(id)
				.setIfMissing({ save: [] })
				.insert('after', 'save[-1]', [
					{
						_key: uuidv4,
						userId: user?.sub,
						postedBy: {
							_type: 'postedBy',
							_ref: user?.sub,
						},
					},
				])
				.commit()
				.then(() => {
					window.location.reload();
					setSavingPost(false);
				});
		}
	};

	const deletePin = (id) => {
		client.delete(id).then(() => {
			window.location.reload();
		});
	};

	return (
		<div className="">
			<div
				onMouseEnter={() => setPostHovered(true)}
				onMouseLeave={() => setPostHovered(false)}
				// onClick={() => navigate(`/community/${_id}`)}
				// style={{ width: '20rem' }}
				className="relative cursor-pointer bg-opacity-75 my-3 w-auto shadow-lg hover:bg-gray-200 rounded-lg overflow-hidden transition-all duration-500"
			>
				<div
					className="flex flex-col justify-between p-4"
					onClick={() => navigate(`/communities/${_id}`)}
				>
					<div className="flex flex-row items-center">
						<img
							src={urlFor(image).width(250).url()}
							className="hidden md:block rounded-lg"
							style={{
								height: '2rem',
								width: '2rem',
								objectFit: 'cover',
							}}
							alt=""
						/>
						<img
							src={urlFor(image).width(250).url()}
							className="block md:hidden rounded-lg"
							style={{
								height: '2rem',
								width: '2rem',
								objectFit: 'cover',
							}}
							alt=""
						/>
						<h1 className="text-dark text-slate-800 font-semibold px-2">
							{title}
						</h1>
					</div>
					<div>
						<p className="text-xs text-slate-600 md:block md:text-sm px-1">
							{about?.substr(0, 116)}
						</p>
						<div
							className=" pt-2 pb-2 bg-opacity-75"
							style={{
								position: 'relative',
								top: 0,
							}}
						>
							<Link
								to={`profile/${postedBy?._id}`}
								className="flex gap-2 mt-2 ms-2 text-center items-center"
							>
								<p className="text-xs capitalize">
									Created by:
								</p>
								<p className="text-xs capitalize">
									{postedBy?.userName}
								</p>
							</Link>
							{user ? (
								<>
									{postedBy?._id !== user?.sub ? (
										<>
											{alreadySaved ? (
												<button
													type="button"
													className="flex flex-row items-center bg-purple-500 mt-5 opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
												>
													{save?.length}{' '}
													<BsPeople className="ml-2" />
												</button>
											) : (
												<button
													onClick={(e) => {
														e.stopPropagation();
														savePin(_id);
													}}
													type="button"
													className="bg-purple-500 mt-5 opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
												>
													Join
												</button>
											)}
										</>
									) : (
										<div>
											<button
												type="button"
												className="flex flex-row items-center bg-purple-500 mt-5 opacity-100 text-white font-bold px-5 py-1 text-base rounded-3xl hover:shadow-md outlined-none"
											>
												{save?.length}{' '}
												<BsPeople className="ml-2" />
											</button>
										</div>
									)}
								</>
							) : (
								<div></div>
							)}
						</div>
					</div>
				</div>
				<div className="divide-black"></div>

				{/* {postHovered && (
					<div
						className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50"
						style={{ height: '100%' }}
					>
						<div className="flex items-center justify-between">
							<div className="flex gap-2">
								<a
									href={`${image?.asset?.url}?dl=`}
									download
									onClick={(e) => e.stopPropagation()}
									className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
								>
									<MdDownloadForOffline />
								</a>
							</div>
						</div>
						<div className="flex justify-between items-center gap-2 w-full">
							{postedBy?._id === user?.sub && (
								<button
									type="button"
									onClick={(e) => {
										e.stopPropagation();
										deletePin(_id);
									}}
									className="bg-white p-2 opacity-100 font-bold text-dark rounded-3xl hover:shadow-md outlined-none"
								>
									<AiTwotoneDelete />
								</button>
							)}
						</div>
					</div>
				)} */}
			</div>
		</div>
	);
};

export default Community;
