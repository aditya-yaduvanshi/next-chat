import {Center, Flex, Spinner} from '@chakra-ui/react';
import User from './User';

interface ITopbar {
	username?: string;
	avatar?: string | null;
	loading?: boolean;
}

const Topbar: React.FC<ITopbar> = ({
	username,
	avatar,
	loading,
}): JSX.Element => {
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
				<User username={username} avatar={avatar ?? undefined} />
			)}
		</Flex>
	);
};

export default Topbar;
