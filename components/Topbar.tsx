import {Center, Flex, IconButton, Spinner} from '@chakra-ui/react';
import {PhoneIcon} from '@chakra-ui/icons';
import User from './User';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebaseconfig';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/router';

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

	const makeVideoCall = async () => {
		const videos = collection(db, 'videos');
		const videoCall = doc(videos);
		try {
			await setDoc(videoCall, {
				createdBy: user?.uid,
				joiners: [user?.uid, uid],
				startedAt: serverTimestamp(),
				ended: false,
			});
			router.push(`/videos/${videoCall.id}`);
		} catch (err) {
			console.log('Error Making Video Call: ',err);
		}
	}

	return (
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
	);
};

export default Topbar;
