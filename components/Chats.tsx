import {useCollection} from 'react-firebase-hooks/firestore';
import {collection} from 'firebase/firestore';
import {auth, db} from '../firebaseconfig';
import {useAuthState} from 'react-firebase-hooks/auth';
import {Center, Spinner} from '@chakra-ui/react';
import {IContact} from './Contacts';
import UserChat from './UserChat';

const Chats: React.FC = (): JSX.Element => {
	const [user] = useAuthState(auth);
	const [chats, loading, error] = useCollection(collection(db, 'chats'));
	const myChats = chats?.docs.filter(chat => chat.data().users.find((usr:IContact) => usr.email === user?.email) ? true : false);

	return (
		<>
			{loading && (
				<Center w='100%'>
					<Spinner />
				</Center>
			)}
			{myChats?.length ? (
				myChats?.map((doc) => {
					const id = doc.id,
						data = doc.data();
					let usr: IContact = data.users.find(
						(usr: IContact) => usr.email !== user?.email
					);
					return (
						<UserChat
							key={id}
							user={usr}
							chatId={id}
						/>
					);
				})
			) : (
				<Center w='100%' h='100%'>
					No Chats Yet
				</Center>
			)}
		</>
	);
};

export default Chats;
