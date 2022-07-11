import {auth, db} from '../firebaseconfig';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection} from 'react-firebase-hooks/firestore';
import {collection} from 'firebase/firestore';
import UserChat from './UserChat';
import {Center, Spinner} from '@chakra-ui/react';

export interface IContact {
	name: string;
	email: string;
	phone: string | null;
	uid: string;
	avatar: string | null;
}

interface IContactProps {
	contactChooser?: boolean;
}

const Contacts: React.FC<IContactProps> = ({contactChooser}): JSX.Element => {
	const [user] = useAuthState(auth);
	const [contacts, loading, error] = useCollection(collection(db, 'contacts'));
	const [chats] = useCollection(collection(db, 'chats'));
	const doc = contacts?.docs
		.find((doc) => doc.data().user === user?.email)
		?.data();

	if (contactChooser && doc) {
		doc.contacts = doc.contacts.filter((contact: IContact) => {
			if (
				chats?.docs.find((chat) =>
					chat
						.data()
						.users.every(
							(usr: IContact) =>
								usr.email === contact.email || usr.email === user?.email
						)
				)
			)
				return false;
			return true;
		});
	}

	return (
		<>
			{loading && (
				<Center w='100%' h='100%'>
					<Spinner />
				</Center>
			)}
			{doc?.contacts.length ? (
				doc?.contacts.map((contact: IContact) => (
					<UserChat
						key={contact.uid}
						user={contact}
						chatId=''
					/>
				))
			) : (
				<Center w='100%' h='100%'>
					{contactChooser && doc?.contacts.length ? "No Contact Left To Start New Chat" : "No Contacts Yet"}
				</Center>
			)}
		</>
	);
};

export default Contacts;
