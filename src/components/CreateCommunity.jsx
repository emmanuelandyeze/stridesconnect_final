import React, { useState } from 'react';
import { AiOutlineCloudUpload } from 'react-icons/ai';
import { MdDelete } from 'react-icons/md';
import { FcAddImage } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';

import { client } from '../client';
import Spinner from './Spinner';
import { categories } from '../utils/data';

import ReactQuill from 'react-quill';
import { domToReact } from 'html-react-parser';

import 'react-quill/dist/quill.snow.css';

const modules = {
	toolbar: [
		[{ header: '1' }, { header: '2' }, { font: [] }],
		[{ size: [] }],
		[
			'bold',
			'italic',
			'underline',
			'strike',
			'blockquote',
			'code-block',
		],
		[
			{ list: 'ordered' },
			{ list: 'bullet' },
			{ indent: '-1' },
			{ indent: '+1' },
		],
		['link', 'image', 'video'],
		['clean'],
	],
	clipboard: {
		matchVisual: false,
	},
};

const formats = [
	'font',
	'size',
	'bold',
	'italic',
	'underline',
	'strike',
	'color',
	'background',
	'script',
	'header',
	'blockquote',
	'code-block',
	'indent',
	'list',
	'direction',
	'align',
	'link',
	'image',
	'video',
	'formula',
];

const options = {
	replace: ({ attribs, children }) => {
		if (!attribs) {
			return;
		}

		if (attribs.h1) {
			return (
				<h1 style={{ fontSize: 42 }}>
					{domToReact(children, options)}
				</h1>
			);
		}

		if (attribs.h1) {
			return (
				<span style={{ color: 'black' }}>
					{domToReact(children, options)}
				</span>
			);
		}

		if (attribs.a) {
			return (
				<span style={{ color: 'blue' }}>
					{domToReact(children, options)}
				</span>
			);
		}
	},
};

const CreateCommunity = ({ user }) => {
	const [title, setTitle] = useState('');
	const [about, setAbout] = useState('');
	const [destination, setDestination] = useState('');
	const [loading, setLoading] = useState(false);
	const [fields, setFields] = useState(false);
	const [category, setCategory] = useState('');
	const [imageAsset, setImageAsset] = useState('');
	const [wrongImageType, setWrongImageType] =
		useState(false);

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

	const savePin = () => {
		if (
			title &&
			about &&
			imageAsset?._id &&
			category
		) {
			const doc = {
				_type: 'community',
				title,
				about,
				destination,
				category,
				image: {
					_type: 'image',
					asset: {
						_type: 'reference',
						_ref: imageAsset?._id,
					},
				},
				userId: user._id,
				postedBy: {
					_type: 'postedBy',
					_ref: user._id,
				},
			};
			client.create(doc).then(() => {
				navigate('/community');
			});
		} else {
			setFields(true);

			setTimeout(() => setFields(false), 2000);
		}
	};

	return (
		<>
			<div className="flex flx-col justify-center items-center mt-5 lg:h-4/5">
				{fields && (
					<p className="text-red-500 mb-5 text-xl transtion-all duration-500 ease-in">
						Please fill in all the fields.
					</p>
				)}
			</div>
			<div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
				<div className="flex lg:flex-row flex-col justify-center items-center w-full bg-white lg:p-5 p-3 lg:w-2/3 md:w-28">
					<div className="bg-gray-200 p-3 flex flex-0.7 w-28 h-28 rounded-full">
						<div className="flex justify-center items-center flex-col rounded-full border-gray-300 p-3 w-28 h-28">
							{loading && <Spinner />}
							{wrongImageType && <p>Wrong image type</p>}
							{!imageAsset ? (
								<label>
									<div className="flex flex-col items-center justify-center h-10">
										<div className="flex flex-col justify-center items-center">
											<p className="font-bold text-2xl">
												<FcAddImage fontSize={60} />
											</p>
											
										</div>
										
									</div>
									<input
										type="file"
										name="upload-image"
										className="w-0 h-0"
										onChange={uploadImage}
									/>
								</label>
							) : (
								<div className="relative h-28 w-28">
									<img
										src={imageAsset?.url}
										className="h-28 w-28 rounded-full object-cover"
										alt=""
									/>
									<button
										type="button"
										className="absolute bottom-3 right-3 rounded-full bg-white text-xl cursor-pointer outline-none hover:shadow-md transition-all duration-500 ease-in-out"
										onClick={() => setImageAsset(null)}
									>
										<MdDelete />
									</button>
								</div>
							)}
						</div>
					</div>
					<div className="flex flex-1 flex-col gap-6 lg:pl-5 mt-5 w-full">
						{user && (
							<div className="flex gap-2 my-2 items-center bg-white rounded-lg">
								<img
									src={user?.image}
									alt=""
									className="w-6 h-6 rounded-full"
								/>
								<p className="font-bold">
									{user?.userName}
								</p>
							</div>
						)}
						<input
							type="text"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							placeholder="Name your community*"
							className="outline-none text-2xl sm:text-3xl font-bold border-b-2 border-gray-200 p-2"
						/>

						<input
							type="text"
							value={about}
							onChange={(e) => setAbout(e.target.value)}
							placeholder="What is your community about?*"
							className="outline-none text-base sm:text-lg border-b-2 border-gray-200 p-2"
						/>
						<div>
							<p className="mb-2 font-semibold text-lg sm:text-xl">
								Choose community category*
							</p>
							<select
								onChange={(e) =>
									setCategory(e.target.value)
								}
								className="outline-none w-4/5 text-base border-b-2 border-gray-200 p-2 rounded-md cursor-pointer"
							>
								<option value="other" className="bg-white">
									Select Category
								</option>
								{categories.map((category) => (
									<option
										className="text-base border-0 outline-none bg-white text-black"
										value={category.name}
									>
										{category.name}
									</option>
								))}
							</select>
						</div>
						<div className="flex justify-end items-end mt-5">
							<button
								type="button"
								onClick={savePin}
								className="bg-red-500 text-white font-bold p-2 rounded-full w-28 outline-none"
							>
								Create
							</button>
						</div>
					</div>
				</div>
			</div>
			<div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
				<p>Set community rules and guidelines</p>
				<ReactQuill
					theme="snow"
					value={destination}
					onChange={setDestination}
					modules={modules}
					formats={formats}
					placeholder="Write your community rules here..."
					options={options}
					className="bg-white lg:p-5 p-3 lg:w-2/3 w-full outline-none text-base sm:text-lg border-b-2 border-gray-200"
				/>
			</div>
		</>
	);
};

export default CreateCommunity;
