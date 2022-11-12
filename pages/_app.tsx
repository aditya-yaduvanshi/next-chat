import type {AppProps} from 'next/app';
import {Center, ChakraProvider, Spinner, Flex} from '@chakra-ui/react';
import Signin from '../components/Signin';
import Sidebar from '../components/Sidebar';
import {auth, db} from '../firebaseconfig';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCallback, useEffect} from 'react';
import {addDoc, collection, getDocs, query, where} from 'firebase/firestore';
import {NextRouter, useRouter} from 'next/router';
import Head from 'next/head';

function MyApp({Component, pageProps}: AppProps) {
	const [user, loading, _err] = useAuthState(auth);
	const router: NextRouter = useRouter();

	const addUser = useCallback(async () => {
		if (!user) return;
		const users = await getDocs(query(collection(db, 'users'), where('email', '==', user?.email)))
		if (users.docs.length) return;
		try {
			await addDoc(collection(db, 'users'), {
				name: user.displayName,
				email: user.email,
				phone: user.phoneNumber,
				uid: user.uid,
				avatar: user.photoURL,
			});
		} catch (err) {}
	}, [user]);

	useEffect(() => {
		if (!user) {
			router.replace('/');
			return;
		}
		addUser();
	}, [user]);

	return (
		<>
			<Head>
				<title>Realtime</title>
				<meta name='description' content='Realtime communication app.' />
				<link rel='icon' href='/realtime.png' />
			</Head>
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
		</>
	);
}

export default MyApp;
