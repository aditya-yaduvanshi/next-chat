import {Center, Flex, Spinner} from '@chakra-ui/react';
import Head from 'next/head';
import {collection, orderBy, query} from 'firebase/firestore';
import {NextPage} from 'next';
import {NextRouter, useRouter} from 'next/router';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection, useDocumentData} from 'react-firebase-hooks/firestore';
import Bottombar from '../../components/Bottombar';
import Message from '../../components/Message';
import Topbar from '../../components/Topbar';
import {auth, db} from '../../firebaseconfig';
import {useEffect, useRef} from 'react';
import {IContact} from '../../components/Contacts';

const ChatsIndex: NextPage = () => {
	const router: NextRouter = useRouter();
	const otherUser = JSON.parse((Array.isArray(router.query.u) ? router.query.u[0] : router.query.u) ?? "{}");

  if(!otherUser.name || !otherUser.avatar) router.replace("/");

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
				/>
				<Flex
					direction='column'
					align='center'
					justify='center'
					p='2'
					h='100%'
					gap='1'
					overflowY='auto'
					sx={{scrollbarWidth: 'none', scrollBehaviour: 'smooth'}}
				>
					No Message Yet.
				</Flex>
				<Bottombar newChat newUser={otherUser} />
			</Flex>
		</>
	);
};

export default ChatsIndex;
