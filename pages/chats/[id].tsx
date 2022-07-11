import {Center, Flex, Spinner} from '@chakra-ui/react';
import Head from 'next/head';
import {collection, orderBy, query} from 'firebase/firestore';
import {NextPage} from 'next';
import {NextRouter, useRouter} from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import Bottombar from '../../components/Bottombar';
import Message from '../../components/Message';
import Topbar from '../../components/Topbar';
import {auth, db} from '../../firebaseconfig';
import {useEffect, useRef} from 'react';
import {IContact} from '../../components/Contacts';

const Chat: NextPage = () => {
	const [user] = useAuthState(auth);
	const [chats, loading, error] = useCollection(collection(db, 'chats'));
	const router: NextRouter = useRouter();
	const [messages, loadingMsg, errorMsg] = useCollection(
		query(
			collection(db, `chats/${router.query.id}/messages`),
			orderBy('timestamp')
		)
	);
	const bottom = useRef<HTMLDivElement>(null);
	const otherUser: IContact = chats?.docs
		.find((doc) => doc.id === router.query.id)
		?.data()
		.users.find((usr: IContact) => usr.email !== user?.email);

	useEffect(() => {
		setTimeout(() => {
			bottom.current?.scrollIntoView({
				behavior: 'smooth',
			});
		}, 100);
	}, [messages?.docs]);

	return (
		<>
			<Head>
				<title>Chat</title>
			</Head>
			<Flex
				direction='column'
				w='75vw'
				justify='space-between'
				flex='1'
				border='1px solid lightgray'
				overflow='hidden'
			>
				<Topbar
					username={otherUser?.name}
					avatar={otherUser?.avatar}
					loading={loading}
				/>
				<Flex
					direction='column'
					align='flex-start'
					p='2'
					h='100%'
					gap='1'
					overflowY='auto'
					sx={{scrollbarWidth: 'none', scrollBehaviour: 'smooth'}}
				>
					{loadingMsg && (
						<Center w='100%' height='100%'>
							<Spinner size='lg' />
						</Center>
					)}
					{user &&
						messages?.docs.map((doc) => (
							<Message key={doc.id} message={doc.data()} user={user.email} />
						))}
					<div ref={bottom}></div>
				</Flex>
				<Bottombar />
			</Flex>
		</>
	);
};

export default Chat;
