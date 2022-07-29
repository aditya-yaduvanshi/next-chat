import type {NextPage} from 'next';
import {Center, Box} from '@chakra-ui/react';

const Home: NextPage = () => {
	return (
		<Box h='100%' w='75vw'>
			<Center w='100%' h='100%'>
				Click on user to see chat messages here.
			</Center>
		</Box>
	);
};

export default Home;
