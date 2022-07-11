import {ArrowForwardIcon} from '@chakra-ui/icons';
import {Button, Flex, IconButton, useDisclosure} from '@chakra-ui/react';
import React, {useState} from 'react';
import User from './User';
import {auth} from '../firebaseconfig';
import {signOut} from 'firebase/auth';
import {useAuthState} from 'react-firebase-hooks/auth';
import ContactModal from './ContactModal';
import Contacts from './Contacts';
import Chats from './Chats';
import ChatModal from './ChatModal';

const Sidebar: React.FC = (): JSX.Element => {
	const [user] = useAuthState(auth);
	const [tab, setTab] = useState<string>('chats');

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
		</Flex>
	);
};

export default Sidebar;
