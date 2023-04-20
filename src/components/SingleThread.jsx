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
    threadDetailQuery,
} from '../utils/data';
import Spinner from './Spinner';

const SingleThread = ({ user }) => {
	const { threadId } = useParams();
	const [pins, setPins] = useState();
	const [threadDetail, setThreadDetail] = useState();
	const [comment, setComment] = useState('');
    const [addingComment, setAddingComment] = useState(false);
    
    console.log(threadId)

	const fetchThreadDetails = () => {
		const query = threadDetailQuery(threadId);

		if (query) {
			client.fetch(`${query}`).then((data) => {
				setThreadDetail(data[0]);
				
			});
		}
	};


	useEffect(() => {
		fetchThreadDetails();
	}, [threadId]);

	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(threadId)
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
					fetchThreadDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	if (!threadDetail) {
		return <Spinner message="Loading Thread..." />;
	}

	return (
		<>
			{threadDetail && (
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
								to={`/profile/${threadDetail?.postedBy._id}`}
								className="flex gap-2 mt-5 items-center bg-white rounded-lg "
							>
								<img
									src={threadDetail?.postedBy.image}
									className="w-10 h-10 rounded-full"
									alt="user-profile"
								/>
								<p className="font-bold">
									{threadDetail?.postedBy.userName}
								</p>
							</Link>
							<div>
								<h1 className="text-2xl md:text-3xl font-semibold text-gray-700 break-words mt-3">
									{threadDetail?.title}
								</h1>
							</div>
							<hr className="my-5" />

							<div className="my-3">
								{threadDetail?.image &&
								urlFor(threadDetail?.image).url() ? (
									<img
										style={{
											height: '20rem',
											width: '100%',
											objectFit: 'cover',
										}}
										src={
											threadDetail?.image &&
											urlFor(threadDetail?.image).url()
										}
										className="rounded-lg"
										alt="user-post"
									/>
								) : (
									<div></div>
								)}
							</div>

							<h2 className="mt-5 text-2xl">
								Comments ({threadDetail?.comments?.length})
							</h2>
							{user ? (
								<>
									<div className="max-h-370 overflow-y-auto">
										{threadDetail?.comments?.map((item) => (
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
									<div
										style={{ width: '50%' }}
										className="md:flex hidden pt-10 flex-wrap fixed bottom-1 mt-6 gap-3"
									>
										<Link to={`/profile/${user?._id}`}>
											<img
												src={user?.image}
												className="w-10 h-10 rounded-full cursor-pointer"
												alt="user-profile"
											/>
										</Link>
										<input
											aria-multiline
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
									<div
										style={{ width: '93%' }}
										className="md:hidden flex flex-wrap pt-10 fixed bottom-16 mt-6 gap-3"
									>
										<Link to={`/profile/${user?._id}`}>
											<img
												src={user?.image}
												className="w-10 h-10 rounded-full cursor-pointer"
												alt="user-profile"
											/>
										</Link>
										<input
											aria-multiline
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
		</>
	);
};

export default SingleThread;
