import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Input,
	FormControl,
	useToast,
	Button,
	useDisclosure,
} from '@chakra-ui/react';
import {addDoc, collection, DocumentData, updateDoc} from 'firebase/firestore';
import React, {useState} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollection, useCollectionData} from 'react-firebase-hooks/firestore';
import {auth, db} from '../firebaseconfig';
import {IContact} from './Contacts';

export interface IModalProps {
	children: any;
}

const ContactModal: React.FC<IModalProps> = ({children}) => {
	const toast = useToast();
	const {isOpen, onClose, onOpen} = useDisclosure();
	const [user] = useAuthState(auth);
	const [newContact, setNewContact] = useState<string>('');
	const [users] = useCollection(
		collection(db, 'users')
	);
	const [contacts] = useCollection(
		collection(db, 'contacts')
	);
	const [chats] = useCollectionData(collection(db, "chats"));

	const addContact = async () => {
		let email = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
		if (!email.test(newContact.toLowerCase())) {
			toast({
				title: 'Invalid Email!',
				description: 'Email you have entered is invalid!',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		if (user?.email === newContact.toLowerCase()) {
			toast({
				title: 'User cannot be added!',
				description:
					'Email you have entered is your own and cannot add you to your contact!',
				status: 'error',
				duration: 3000,
				isClosable: true,
				position: 'top',
			});
			return;
		}
		let contact: IContact | DocumentData;
		let docExists = contacts?.docs.find(
			(doc) => doc.data().user === user?.email
		);
		if (docExists) {
			let data = docExists.data();
			if (
				data.contacts.find(
					(con: IContact) => con.email === newContact.trim().toLowerCase()
				)
			) {
				toast({
					title: 'User Already exists!',
					description:
						'Email you have entered is already in your contact list!',
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
				return;
			}
			let usr = users?.docs.find(
				(doc) => doc.data().email === newContact.trim().toLowerCase()
			);
			if (!usr) {
				toast({
					title: 'User does not exists!',
					description: 'Email you have entered does not exists!',
					status: 'error',
					duration: 3000,
					isClosable: true,
					position: 'top',
				});
				return;
			}
			contact = usr.data();
			await updateDoc(docExists.ref, {
				...data,
				contacts: [...data.contacts, contact],
			});
		} else {
			let usr = users?.docs.find(
				(doc) => doc.data().email === newContact.trim().toLowerCase()
			);
			if (!usr) return;
			contact = usr.data();
			await addDoc(collection(db, 'contacts'), {
				user: user?.email,
				contacts: [contact],
			});
		}
		setNewContact('');
		onClose();
	};
	return (
		<>
			{React.cloneElement(children, {onClick: onOpen})}
			<Modal
				isOpen={isOpen}
				onClose={() => {
					setNewContact('');
					onClose();
				}}
			>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>Add New Contact</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<FormControl>
							<Input
								onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
									setNewContact(e.target.value)
								}
								value={newContact}
								type='email'
								placeholder='Enter email of the user.'
								required
							/>
						</FormControl>
					</ModalBody>
					<ModalFooter>
						<Button
							colorScheme='gray'
							mr={3}
							onClick={() => {
								setNewContact('');
								onClose();
							}}
						>
							Cancel
						</Button>
						<Button colorScheme='blue' onClick={addContact}>
							Add To Contact
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ContactModal;
