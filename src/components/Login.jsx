import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import {
	GoogleLogin,
	googleLogout,
} from '@react-oauth/google';
import jwt_decode from 'jwt-decode';
import { client } from '../client';
import { userQuery } from '../utils/data';

const Login = () => {
	const navigate = useNavigate();
	const [user, setUser] = useState(null)

	const User =
		localStorage.getItem('user') !== 'undefined'
			? JSON.parse(localStorage.getItem('user'))
			: localStorage.clear();

	useEffect(() => {
		if (User) {
			const query = userQuery(User?.sub);
			client.fetch(query).then((data) => {
				setUser(data[0]);
			});
		}
	}, [User, user]);

	const responseGoogle = (response) => {
		const decoded = jwt_decode(response.credential);
		localStorage.setItem('user', JSON.stringify(decoded));

		const { name, sub, picture, email } = decoded;

		const doc = {
			_id: sub,
			_type: 'user',
			userName: name,
			image: picture,
			email: email,
			interests: ''
		};

		client.createIfNotExists(doc)
			.then(() => {
				if (user && user?.interests === '') {
				  navigate('/onboarding', { replace: true });
				} else {
					navigate('/', { replace: true });
			  }
		  
		})
	};
	return (
		<div className="flex justify-start items-center flex-col h-screen">
			<div className="relative w-full h-full">
				<div className="absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay">
					<div className="p-5">
						<div>
							<GoogleLogin
								onSuccess={responseGoogle}
								onError={responseGoogle}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Login;
