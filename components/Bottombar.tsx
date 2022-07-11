import {ArrowRightIcon} from '@chakra-ui/icons';
import {Button, Flex, FormControl, Input} from '@chakra-ui/react';
import {addDoc, collection, serverTimestamp} from 'firebase/firestore';
import {useRouter} from 'next/router';
import {useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {auth, db} from '../firebaseconfig';
import { IContact } from './Contacts';

interface IBottombar {
	newChat?: boolean;
	newUser?: IContact;
}

const Bottombar: React.FC<IBottombar> = ({newChat, newUser}): JSX.Element => {
	const [input, setInput] = useState('');
	const [user] = useAuthState(auth);
	const router = useRouter();
	const sendMessage = async () => {
		if (!input.trim()) return;
		if(!(newChat && newUser) && !router.query.id) return;
		let refDoc;
		if(newChat){
			refDoc = await addDoc(collection(db, "chats"), {
				users: [newUser, {
					name: user?.displayName,
					email: user?.email,
					phone: user?.phoneNumber,
					avatar: user?.photoURL,
					uid: user?.uid
				}]
			})
		}
		await addDoc(collection(db, `chats/${router.query.id ?? refDoc?.id}/messages`), {
			sender: {
				name: user?.displayName,
				email: user?.email,
				phone: user?.phoneNumber,
				avatar: user?.photoURL,
				uid: user?.uid,
			},
			text: input,
			timestamp: new Date().toLocaleString(),
		});
		setInput('');
		if(refDoc)
		router.replace(`/chats/${refDoc?.id}`);
	};
	return (
		<Flex p='4' borderTop='1px solid lightgray' gap='4'>
			<FormControl>
				<Input
					placeholder='Type a message here!'
					onChange={(e) => setInput(e.target.value)}
					value={input}
				/>
			</FormControl>
			<Button onClick={sendMessage} bgColor='blue.500'>
				Send <ArrowRightIcon ml='5' />
			</Button>
		</Flex>
	);
};

export default Bottombar;
