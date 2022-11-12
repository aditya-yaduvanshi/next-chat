import {ArrowForwardIcon} from '@chakra-ui/icons';
import {Button, Flex, IconButton} from '@chakra-ui/react';
import React, {useEffect, useState} from 'react';
import User from './User';
import {auth, db} from '../firebaseconfig';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import ContactModal from './ContactModal';
import Contacts from './Contacts';
import Chats from './Chats';
import ChatModal from './ChatModal';
import {collection, query, where, onSnapshot, orderBy, limit} from 'firebase/firestore';
import CallModal from './CallModal';
import { useRouter } from 'next/router';

const Sidebar: React.FC = (): JSX.Element => {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [tab, setTab] = useState<string>('chats');

	const newCallQuery = query(collection(db, "videos"), where("ended", "==", false), where('joiners', 'array-contains', user?.uid), where('createdBy', '!=', user?.uid), orderBy('createdBy'), orderBy('startedAt', 'desc'), limit(1));

	const [callModal, setCallModal] = useState(false);
	const [newCall, setNewCall] = useState<{id: string}>();

	useEffect(() => {
		
		const unsubscribe = onSnapshot(newCallQuery, (querySnapshot) => {
			let callDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
			if(!callDoc) return;
			if(newCall?.id === callDoc.id) return;
			setNewCall({id: callDoc.id, ...callDoc.data()});
			setCallModal(true);
		});

		return () => unsubscribe();
	}, [newCallQuery]);

	return (
		<Flex
			h='100%'
			w='25vw'
			bgColor='aliceBlue'
			direction='column'
			border='1px solid lightgray'
		>
			<Flex
				align='center'
				justify='space-between'
				p='2'
				boxShadow='sm'
				zIndex='1'
				borderBottom='1px solid lightgray'
			>
				<User
					username={user?.displayName ?? undefined}
					avatar={user?.photoURL ?? undefined}
				/>
				<IconButton
					onClick={() => signOut(auth)}
					icon={<ArrowForwardIcon />}
					aria-label='Sign Out'
					bgColor='red.500'
					color='white'
					border='1px solid gray'
					_hover={{color: 'gray', bgColor: 'red.100'}}
				/>
			</Flex>
			<Flex align='center' justify='space-evenly' gap='3' p='3' bgColor='white'>
				<ChatModal>
					<Button w='100%' border='1px solid gray'>
						New Chat
					</Button>
				</ChatModal>
				<ContactModal>
					<Button w='100%' border='1px solid gray'>
						Add Contact
					</Button>
				</ContactModal>
			</Flex>
			<Flex overflowY='auto' direction='column' py='2' scrollBehavior='smooth'>
				<Flex px='2' gap='2' mb='2' boxShadow='md'>
					<Button
						w='100%'
						variant='ghost'
						borderBottom={tab === 'chats' ? '2px solid blue' : undefined}
						rounded='none'
						_focus={{boxShadow: 'none', outline: 'none'}}
						onClick={() => setTab('chats')}
					>
						Chats
					</Button>
					<Button
						w='100%'
						variant='ghost'
						rounded='none'
						borderBottom={tab === 'contacts' ? '2px solid blue' : undefined}
						onClick={() => setTab('contacts')}
						_focus={{boxShadow: 'none', outline: 'none'}}
					>
						Contacts
					</Button>
				</Flex>
				{tab === 'chats' ? <Chats /> : <Contacts />}
			</Flex>
			<CallModal isOpen={callModal} onClose={() => setCallModal(false)} onAccept={() => {
				setCallModal(false);
				router.push('/videos/' + newCall?.id);
				setNewCall(undefined);
			}} />
		</Flex>
	);
};

export default Sidebar;
