import {Avatar, Flex, Heading} from '@chakra-ui/react';
import React from 'react';

interface IUserProps {
	avatar?: string;
	username?: string;
}

const User: React.FC<IUserProps> = ({avatar, username}): JSX.Element => {
	return (
		<Flex align='center' gap='3' p='2'>
			<Avatar src={avatar} />
			<Heading size='md'>{username ?? ''}</Heading>
		</Flex>
	);
};

export default User;
