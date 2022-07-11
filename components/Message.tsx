import {Box, Flex, Heading, Text} from '@chakra-ui/react';
import {DocumentData} from 'firebase/firestore';
import {IContact} from './Contacts';

export interface IMessage {
	message: {
		sender: IContact;
		text: string;
		timestamp: string;
	} | DocumentData;
	user: string | null;
}

const Message: React.FC<IMessage> = ({message, user}): JSX.Element => {
	return (
		<Flex
			w='100%'
			p='1'
			direction='column'
			align={user === message.sender.email ? 'flex-end' : 'flex-start'}
		>
			<Heading size='sm' px='2' py='1'>
				{message.sender.name}
			</Heading>
			<Box
				bgColor={user === message.sender.email ? 'blue.50' : 'blue.100'}
				rounded='xl'
				px='2'
				py='1'
				w='fit-content'
			>
				<Text>{message.text}</Text>
				<Text>{message.timestamp}</Text>
			</Box>
		</Flex>
	);
};

export default Message;
