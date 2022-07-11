import type {AppProps} from 'next/app';
import {Center, ChakraProvider, Spinner, Flex} from '@chakra-ui/react';
import Signin from '../components/Signin';
import Sidebar from '../components/Sidebar';
import {auth, db} from '../firebaseconfig';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCallback, useEffect} from 'react';
import {addDoc, collection} from 'firebase/firestore';
import {useCollectionData} from 'react-firebase-hooks/firestore';
import { NextRouter, useRouter } from 'next/router';

function MyApp({Component, pageProps}: AppProps) {
	const [user, loading, _err] = useAuthState(auth);
	const [users] = useCollectionData(collection(db, 'users'));
	const router:NextRouter = useRouter();

	const addUser = useCallback(async () => {
		if (!user) return;
		if (users?.find((usr) => usr.email === user.email))
			return;
		try {
			await addDoc(collection(db, 'users'), {
				name: user.displayName,
				email: user.email,
				phone: user.phoneNumber,
				uid: user.uid,
				avatar: user.photoURL,
			});
		} catch (err) {}
	}, [users]);

	useEffect(() => {
		if(!user) {
			router.replace("/");
			return;
		}
		addUser();
	}, [user]);

	return (
		<ChakraProvider>
			{loading && (
				<Center h='100vh'>
					<Spinner size='xl' />
				</Center>
			)}
			{user ? (
				<Flex overflow='hidden' h='100vh'>
					<Sidebar />
					<Component {...pageProps} />
				</Flex>
			) : (
				<Signin />
			)}
		</ChakraProvider>
	);
}

export default MyApp;
