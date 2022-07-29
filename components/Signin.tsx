import Head from 'next/head';
import React from 'react';
import {ChatIcon} from '@chakra-ui/icons';
import {Box, Button, Center, Flex, Text} from '@chakra-ui/react';
import {
	useSignInWithFacebook,
	useSignInWithGithub,
	useSignInWithGoogle,
	useSignInWithMicrosoft,
	useSignInWithTwitter,
} from 'react-firebase-hooks/auth';
import {auth} from '../firebaseconfig';

const Signin: React.FC = (): JSX.Element => {
	const [google] = useSignInWithGoogle(auth);
	const [github] = useSignInWithGithub(auth);
	const [facebook] = useSignInWithFacebook(auth);
	const [twitter] = useSignInWithTwitter(auth);
	const [microsoft] = useSignInWithMicrosoft(auth);

	return (
		<>
			<Head>
				<title>Sign In</title>
				<meta name='description' content='Signin to next realtime.' />
			</Head>
			<Center h='100vh'>
				<Flex
					alignItems='center'
					justifyContent='space-around'
					gap={10}
					bgColor='LightGray'
					p='10'
					rounded='3xl'
					boxShadow='lg'
				>
					<Flex gap={4} flexDirection='column'>
						<Box bgColor='blue.600' p='6' rounded='xl' boxShadow='2xl'>
							<ChatIcon w='32' h='32' color='white' />
						</Box>
						<Text
							textAlign='center'
							fontSize='2xl'
							rounded='xl'
							pb='1'
							fontWeight='bold'
							bgColor='blue.600'
							color='white'
						>
							Realtime
						</Text>
					</Flex>

					<Flex flexDirection='column' gap={2} w='48'>
						<Button
							w='100%'
							bgColor='red.500'
							color='white'
							boxShadow='lg'
							_hover={{bgColor: 'red.700'}}
							onClick={() => google()}
							_focus={{outline: 'none'}}
						>
							Google
						</Button>
						<Button
							w='100%'
							bgColor='blackAlpha.500'
							color='white'
							boxShadow='lg'
							_hover={{bgColor: 'blackAlpha.700'}}
							onClick={() => github()}
							_focus={{outline: 'none'}}
						>
							Github
						</Button>
						<Button
							w='100%'
							bgColor='facebook.500'
							color='white'
							boxShadow='lg'
							_hover={{bgColor: 'facebook.700'}}
							onClick={() => facebook()}
							_focus={{outline: 'none'}}
						>
							Facebook
						</Button>
						<Button
							w='100%'
							bgColor='cyan.500'
							color='white'
							boxShadow='lg'
							_hover={{bgColor: 'cyan.700'}}
							onClick={() => microsoft()}
							_focus={{outline: 'none'}}
						>
							Microsoft
						</Button>
						<Button
							w='100%'
							bgColor='twitter.500'
							color='white'
							boxShadow='lg'
							_hover={{bgColor: 'twitter.700'}}
							onClick={() => twitter()}
							_focus={{outline: 'none'}}
						>
							Twitter
						</Button>
					</Flex>
				</Flex>
			</Center>
		</>
	);
};

export default Signin;
