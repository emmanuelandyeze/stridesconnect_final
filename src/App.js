import React, { useEffect } from 'react';
import {
	Routes,
	Route,
	useNavigate,
} from 'react-router-dom';
import Home from './container/Home';
import Login from './components/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { fetchUser } from './utils/fetchUser';
import Onboarding from './components/Onboarding';

const App = () => {
	const navigate = useNavigate();

	// useEffect(() => {
	// 	const user = fetchUser();

	// 	if (!user) navigate('/login');
	// }, []);
	return (
		<GoogleOAuthProvider clientId="979909461173-muh0beffru01ja89qea3islerr9iegqp.apps.googleusercontent.com">
			<Routes>
				<Route path="login" element={<Login />} />
				<Route path="onboarding" element={<Onboarding />} />
				<Route path="/*" element={<Home />} />
			</Routes>
		</GoogleOAuthProvider>
	);
};

export default App;
