import React, { useEffect, useState } from 'react';
import { MdDownloadForOffline } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import parse from 'html-react-parser';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import {
	pinDetailMorePinQuery,
	pinDetailQuery,
} from '../utils/data';
import Spinner from './Spinner';

const PinDetail = ({ user }) => {
	const { pinId } = useParams();
	const [pins, setPins] = useState();
	const [pinDetail, setPinDetail] = useState();
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);

	const fetchPinDetails = () => {
		const query = pinDetailQuery(pinId);

		if (query) {
			client.fetch(`${query}`).then((data) => {
				setPinDetail(data[0]);
				console.log(data);
				if (data[0]) {
					const query1 = pinDetailMorePinQuery(data[0]);
					client.fetch(query1).then((res) => {
						setPins(res);
					});
				}
			});
		}
	};


	useEffect(() => {
		fetchPinDetails();
	}, [pinId]);

	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(pinId)
				.setIfMissing({ comments: [] })
				.insert('after', 'comments[-1]', [
					{
						comment,
						_key: uuidv4(),
						postedBy: { _type: 'postedBy', _ref: user._id },
					},
				])
				.commit()
				.then(() => {
					fetchPinDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	if (!pinDetail) {
		return <Spinner message="Loading Story..." />;
	}

	return (
		<>
			{pinDetail && (
				<>
					<div
						className="flex xl:flex-row flex-col m-auto bg-white"
						style={{
							maxWidth: '800px',
							// borderRadius: '32px',
						}}
					>
						<div className="w-full lg:w-4/5 p-5 flex-1 xl:min-w-620">
							<div className="flex items-center justify-between"></div>
							<Link
								to={`/profile/${pinDetail?.postedBy._id}`}
								className="flex gap-2 mt-5 items-center bg-white rounded-lg "
							>
								<img
									src={pinDetail?.postedBy.image}
									className="w-10 h-10 rounded-full"
									alt="user-profile"
								/>
								<p className="font-bold">
									{pinDetail?.postedBy.userName}
								</p>
							</Link>
							<div>
								<h1 className="text-2xl md:text-3xl font-semibold text-gray-700 break-words mt-3">
									{pinDetail?.title}
								</h1>
								<p className="mt-3 font-normal text-italics text-gray-400">
									{pinDetail?.about}
								</p>
								<p className="mt-3 font-normal text-gray-400">
									{pinDetail?.createdAt}
								</p>
							</div>
							<hr className='my-5' />

							<div className="my-3">
								<img
									style={{
										height: '20rem',
										width: '100%',
										objectFit: 'cover',
									}}
									src={
										pinDetail?.image &&
										urlFor(pinDetail?.image).url()
									}
									className="rounded-lg"
									alt="user-post"
								/>
							</div>
							<div>
								<p className="text-gray-500">
									{parse(pinDetail?.destination)}
								</p>
							</div>
							<h2 className="mt-5 text-2xl">Comments</h2>
							{user ? (
								<>
									<div className="max-h-370 overflow-y-auto">
										{pinDetail?.comments?.map((item) => (
											<div
												className="flex gap-2 mt-5 items-center bg-white rounded-lg"
												key={item.comment}
											>
												<img
													src={item.postedBy?.image}
													className="w-10 h-10 rounded-full cursor-pointer"
													alt="user-profile"
												/>
												<div className="flex flex-col">
													<p className="font-bold">
														{item.postedBy?.userName}
													</p>
													<p>{item.comment}</p>
												</div>
											</div>
										))}
									</div>
									<div className="flex flex-wrap mt-6 gap-3">
										<Link to={`/profile/${user?._id}`}>
											<img
												src={user?.image}
												className="w-10 h-10 rounded-full cursor-pointer"
												alt="user-profile"
											/>
										</Link>
										<input
											className=" flex-1 border-gray-100 outline-none border-2 p-2 rounded-2xl focus:border-gray-300"
											type="text"
											placeholder="Add a comment"
											value={comment}
											onChange={(e) =>
												setComment(e.target.value)
											}
										/>
										<button
											type="button"
											className="bg-red-500 text-white rounded-full px-6 py-2 font-semibold text-base outline-none"
											onClick={addComment}
										>
											{addingComment
												? 'Posting...'
												: 'Post'}
										</button>
									</div>
								</>
							) : (
								<div>
									<p>Login to view and post comments</p>
								</div>
							)}
						</div>
					</div>
				</>
			)}
			<div
				className="m-auto bg-white pt-5"
				style={{
					maxWidth: '800px',
					// borderRadius: '32px',
				}}
			>
				{pins?.length > 0 && (
					<h2 className="text-center font-bold text-2xl mt-8 mb-4">
						More like this
					</h2>
				)}
				{pins ? (
					<MasonryLayout pins={pins} />
				) : (
					<Spinner message="Loading more pins" />
				)}
			</div>
		</>
	);
};

export default PinDetail;
