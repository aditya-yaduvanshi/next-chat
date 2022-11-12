import {
	Avatar,
	Button,
	Center,
	Flex,
	IconButton,
	Modal,
	ModalBody,
	ModalContent,
	ModalHeader,
	ModalOverlay,
	Spinner,
	Text,
} from '@chakra-ui/react';
import {PhoneIcon} from '@chakra-ui/icons';
import User from './User';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebaseconfig';
import {
	collection,
	doc,
	DocumentData,
	DocumentReference,
	onSnapshot,
	serverTimestamp,
	setDoc,
	updateDoc,
	where,
} from 'firebase/firestore';
import {useRouter} from 'next/router';
import {useEffect, useState} from 'react';

interface ITopbar {
	username?: string;
	avatar?: string | null;
	loading?: boolean;
	uid?: string;
}

const Topbar: React.FC<ITopbar> = ({
	username,
	avatar,
	loading,
	uid,
}): JSX.Element => {
	const [user] = useAuthState(auth);
	const router = useRouter();
	const [isOpen, setIsOpen] = useState(false);
	const [call, setCall] = useState<DocumentReference<DocumentData>>();

	const makeVideoCall = async () => {
		setIsOpen(true);
		const videos = collection(db, 'videos');
		const videoCall = doc(videos);
		try {
			await setDoc(videoCall, {
				createdBy: user?.uid,
				joiners: [user?.uid, uid],
				startedAt: serverTimestamp(),
				ended: false,
				responded: false,
			});
			setCall(videoCall);
		} catch (err) {
			console.log('Error Making Video Call: ', err);
			setIsOpen(false);
		}
	};

	const endCall = async () => {
		const videos = collection(db, 'videos');
		const videoCall = doc(videos);
		try {
			await updateDoc(videoCall, {
				ended: true,
			});
		} catch (err) {
			console.log('Error Making Video Call: ', err);
		}
		setIsOpen(false);
	};

	useEffect(() => {
		if (!call) return;
		const unsubscribe = onSnapshot(call, (snapshot) => {
			if (!snapshot.get('responded')) return;
			setIsOpen(false);
			if(snapshot.get('ended')) return;
			router.push('/videos/' + call.id);
		});

		return () => {
			unsubscribe();
		}
	}, [call]);

	return (
		<>
			<Flex
				w='100%'
				bgColor='aliceblue'
				borderBottom='1px solid lightgray'
				p='2'
				align='center'
				boxShadow='sm'
				zIndex='1'
			>
				{loading ? (
					<Center h='100%' w='100%' p='5'>
						<Spinner size='md' />
					</Center>
				) : (
					<>
						<User username={username} avatar={avatar ?? undefined} />
						<IconButton
							icon={<PhoneIcon />}
							aria-label='Phone Call'
							bgColor='green.500'
							color='white'
							border='1px solid gray'
							_hover={{color: 'gray', bgColor: 'green.100'}}
							onClick={makeVideoCall}
						>
							Video Call
						</IconButton>
					</>
				)}
			</Flex>
			<Modal isOpen={isOpen} onClose={() => {}}>
				<ModalOverlay />
				<ModalContent pb='5'>
					<ModalHeader>Calling...</ModalHeader>
					<ModalBody>
						<Flex justifyContent='center' direction='column' p='2' gap='5'>
							<Flex
								justifyContent='center'
								direction='column'
								alignItems='center'
							>
								<Avatar src={avatar ?? ''} size='2xl' />
								<Text fontSize='large'>{username}</Text>
							</Flex>

							<Button
								onClick={endCall}
								variant='solid'
								color='white'
								bgColor='red.500'
								_hover={{bgColor: 'red.300'}}
							>
								End Call
							</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default Topbar;
