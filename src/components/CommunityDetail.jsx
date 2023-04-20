import React, { Fragment, useEffect, useRef, useState } from 'react';
import { MdDelete, MdDownloadForOffline } from 'react-icons/md';
import { Link, Route, Routes, useNavigate, useParams } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import parse from 'html-react-parser';
import { Dialog, Transition } from '@headlessui/react';

import { client, urlFor } from '../client';
import MasonryLayout from './MasonryLayout';
import {
    communityDetailQuery,
	communityThreadQuery,
	pinDetailMorePinQuery,
	pinDetailQuery,
} from '../utils/data';
import Spinner from './Spinner';
import { TfiWrite } from 'react-icons/tfi';
import { BsPeopleFill } from 'react-icons/bs';
import { FcAddImage } from 'react-icons/fc';
import { FaRegCommentAlt } from 'react-icons/fa'
import {BiRightArrow} from 'react-icons/bi'
import SingleThread from './SingleThread';
import { AiOutlinePlus } from 'react-icons/ai';

const CommunityDetail = ({ user }) => {
	const { communityId } = useParams();
	const [pins, setPins] = useState();
	const [communityDetail, setCommunityDetail] = useState();
	const [comment, setComment] = useState('');
	const [addingComment, setAddingComment] = useState(false);
	const [title, setTitle] = useState('');
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useState(false);
	const [category, setCategory] = useState('');
	const [imageAsset, setImageAsset] = useState('');
	const [wrongImageType, setWrongImageType] =
		useState(false);
	const [threads, setThreads] = useState(null)
	const [open, setOpen] = useState(false);

	const cancelButtonRef = useRef(null);
	const navigate = useNavigate();
	
	
	const uploadImage = (e) => {
		const { type, name } = e.target.files[0];

		if (
			type === 'image/png' ||
			type === 'image/svg' ||
			type === 'image/jpeg' ||
			type === 'image/gif' ||
			type === 'image/tiff'
		) {
			setWrongImageType(false);
			setLoading(true);

			client.assets
				.upload('image', e.target.files[0], {
					contentType: type,
					filename: name,
				})
				.then((document) => {
					setImageAsset(document);
					setLoading(false);
				})
				.catch((error) => {
					console.log('Image upload error ', error);
				});
		} else {
			setWrongImageType(true);
		}
	};

	const saveThread = () => {
		if (
			title ||
			imageAsset?._id
		) {
			const doc = {
				_type: 'thread',
				title,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset?._id,
					},
				},
				userId: user._id,
				communityId,
				postedBy: {
					_type: 'postedBy',
					_ref: user._id,
				},
			};
			client.create(doc).then(() => {
				window.location.reload()
			});
		} else {
			setFields(true);

			setTimeout(() => setFields(false), 2000);
		}
	};


	const fetchCommunityDetails = () => {
		const query = communityDetailQuery(communityId);

		if (query) {
			client.fetch(`${query}`).then((data) => {
				setCommunityDetail(data[0]);
				
			});
		}
	};


	useEffect(() => {
		setLoading(true)
		fetchCommunityDetails();
		const query = communityThreadQuery(communityId);
		client.fetch(query).then((data) => {
			setThreads(data);
			setLoading(false);
		});
	}, [communityId, comment]);




	const addComment = () => {
		if (comment) {
			setAddingComment(true);

			client
				.patch(communityId)
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
					fetchCommunityDetails();
					setComment('');
					setAddingComment(false);
				});
		}
	};

	

	if (!CommunityDetail) {
		return <Spinner message="Loading Community..." />;
	}

	return (
		<>
			{communityDetail && (
				<>
					<div
						className="flex xl:flex-row flex-col m-auto bg-white"
						style={{
							maxWidth: '800px',
							// borderRadius: '32px',
						}}
					>
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
											<Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-1 sm:w-full sm:max-w-lg">
												<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
													<div className="sm:flex sm:items-start">
														<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
															<Dialog.Title
																as="h3"
																className="text-base font-semibold leading-6 text-gray-900"
															>
																Create a thread
															</Dialog.Title>
															<div className="mt-2">
																<div className="text-center">
																	<textarea
																		className="border-2 md:w-96 w-full rounded-lg p-2"
																		name=""
																		id=""
																		type="text"
																		value={title}
																		onChange={(e) =>
																			setTitle(
																				e.target.value,
																			)
																		}
																		placeholder="What do you want to talk about?"
																	></textarea>
																</div>
															</div>
															<div className="bg-gray-200 p-3 flex flex-0.7 w-28 h-28 rounded-full">
																<div className="flex justify-center items-center flex-col rounded-full border-gray-300 p-3 w-28 h-28">
																	{loading && <Spinner />}
																	{wrongImageType && (
																		<p>Wrong image type</p>
																	)}
																	{!imageAsset ? (
																		<label>
																			<div className="flex flex-col items-center justify-center h-10">
																				<div className="flex flex-col justify-center items-center">
																					<p className="font-bold text-2xl">
																						<FcAddImage
																							fontSize={60}
																						/>
																					</p>
																				</div>
																			</div>
																			<input
																				type="file"
																				name="upload-image"
																				className="w-0 h-0"
																				onChange={
																					uploadImage
																				}
																			/>
																		</label>
																	) : (
																		<div className="relative h-28 w-28">
																			<img
																				src={
																					imageAsset?.url
																				}
																				className="h-28 w-28 rounded-full object-cover"
																				alt=""
																			/>
																			<button
																				type="button"
																				className="absolute bottom-3 right-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
																				onClick={() =>
																					setImageAsset(
																						null,
																					)
																				}
																			>
																				<MdDelete />
																			</button>
																		</div>
																	)}
																</div>
															</div>
														</div>
													</div>
												</div>
												<div className="bg-gray-50 px-4 py-3 gap-3 sm:flex sm:flex-row-reverse sm:px-6">
													<button
														type="button"
														onClick={saveThread}
														className="bg-purple-500 text-white font-bold p-2 rounded-lg w-28 outline-none"
													>
														Post
													</button>
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

						<div className="w-full lg:w-4/5 p-5 flex-1 xl:min-w-620">
							<div className="flex items-center justify-between"></div>
							<Link
								to={`/profile/${communityDetail?.postedBy._id}`}
								className="flex gap-2 mt-5 items-center bg-white rounded-lg "
							>
								<img
									src={
										communityDetail?.image &&
										urlFor(communityDetail?.image).url()
									}
									className="w-10 h-10 rounded-full"
									alt="user-profile"
								/>
								<p className="font-bold">
									{communityDetail?.title}
								</p>
							</Link>
							<div>
								<h1 className="text-2xl md:text-3xl font-semibold text-gray-700 break-words mt-3">
									{communityDetail?.title}
								</h1>
								<p className="mt-3 font-normal text-italics text-gray-400">
									{communityDetail?.about}
								</p>
							</div>
							<div
								className="mt-2 -ml-2"
								style={{
									position: 'fixed',
									bottom: 10,
									right: 5,
								}}
							>
								{user && user?._id ? (
									<button
										type="button"
										className="inline-flex justify-center w-24 mr-3 rounded-md bg-purple-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-purple-500 sm:ml-3 sm:w-auto"
										onClick={() => setOpen(true)}
									>
										<AiOutlinePlus size={30} />
									</button>
								) : (
									<div></div>
								)}
							</div>
							<hr className="my-5" />

							<div>
								<p className="text-gray-500">
									{parse(communityDetail?.destination)}
								</p>
							</div>

							{user ? (
								<>
									{threads?.map((item) => (
										<div
											className="py-4 cursor-pointer"
											style={{
												borderBottom:
													'.5px solid rgb(229 231 235)',
											}}
											onClick={() =>
												navigate(`/thread/${item._id}`)
											}
										>
											<div className="flex flex-row items-start">
												<div
													className="bg-white flex rounded-lg "
													key={item._id}
												>
													<img
														src={item.postedBy?.image}
														className="w-10 h-10 mr-2 rounded-full cursor-pointer"
														alt="user-profile"
													/>
													<div className="bg-gray-300 p-3 rounded-lg">
														<div className="flex flex-col">
															<p className="font-bold">
																{item.postedBy?.userName}
															</p>
														</div>
														<h1>{item?.title}</h1>
														{item?.image && (
															<img
																style={{
																	height: '20rem',
																	width: '100%',
																	objectFit: 'cover',
																}}
																src={
																	item?.image &&
																	urlFor(item?.image).url()
																}
																className="rounded-lg mt-3"
																alt=""
															/>
														)}

														<div className="flex flex-row mt-3 justify-between">
															<div className="flex flex-row items-center">
																<FaRegCommentAlt className="mr-1" />
																{!item?.comments ? (
																	<p>0</p>
																) : (
																	<p>
																		{item.comments.length}
																	</p>
																)}
															</div>
															<div className="flex flex-row items-center">
																<p>Join Convo</p>
																<BiRightArrow />
															</div>
														</div>
													</div>
												</div>
											</div>
										</div>
									))}
								</>
							) : (
								<div>
									<p>
										Login to view and post in this community
									</p>
								</div>
							)}
						</div>
					</div>
				</>
			)}
		</>
	);
};

export default CommunityDetail;
