import {Avatar, Box, Flex, Heading, Text} from '@chakra-ui/react';
import Link from 'next/link';
import {NextRouter, useRouter} from 'next/router';
import { IContact } from './Contacts';

interface IUserChatProps {
	user: IContact;
	chatId?: string;
}

const UserChat: React.FC<IUserChatProps> = ({
	user,
	chatId
}): JSX.Element => {
	const router: NextRouter = useRouter();
	return (
		<Link href={`/chats/${chatId ? chatId : "?u=" + JSON.stringify(user)}`}>
			<a>
				<Flex
					borderBottom='1px solid lightgray'
					align='center'
					p='2'
					gap='4'
					_hover={{
						bgColor: 'blackAlpha.200',
						cursor: 'pointer',
						transition: '0.1s ease-in-out',
					}}
					bgColor={router.query.id === chatId ? 'blackAlpha.200' : ''}
					_active={{bgColor: 'aliceblue'}}
				>
					<Avatar w='16' h='16' src={user.avatar ?? undefined} />
					<Box>
						<Heading size='sm'>{user.name}</Heading>
					</Box>
				</Flex>
			</a>
		</Link>
	);
};

export default UserChat;
