import Head from 'next/head';
import React from 'react';
import {ChatIcon} from '@chakra-ui/icons';
import {Box, Button, Center, Stack} from '@chakra-ui/react';
import {useSignInWithGithub, useSignInWithGoogle} from 'react-firebase-hooks/auth';
import {auth} from '../firebaseconfig';

const Signin: React.FC = (): JSX.Element => {
	const [signinWithGoogle] = useSignInWithGoogle(auth);
	const [signinWithGithub] = useSignInWithGithub(auth);

	const signin = (type: string = "google"): void => {
		if(type === "github"){
			signinWithGithub();
		} else {
			signinWithGoogle(undefined, {prompt: "select_account"});
		}
	};
	return (
		<>
			<Head>
				<title>Sign In</title>
				<meta name='description' content='Signin to next realtime.' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<Center h='100vh'>
				<Stack
					align='center'
					spacing='5'
					bgColor='LightGray'
					p='20'
					rounded='3xl'
					boxShadow='lg'
				>
					<Box bgColor='blue.600' p='6' rounded='xl' boxShadow='2xl'>
						<ChatIcon w='32' h='32' color='white' />
					</Box>
					<Button
						w='100%'
						bgColor='red.500'
						color='white'
						boxShadow='lg'
						_hover={{bgColor: 'red.700'}}
						onClick={() => signin('google')}
						_focus={{outline: 'none'}}
					>
						Sign In With Google
					</Button>
					<Button
						w='100%'
						bgColor='blackAlpha.500'
						color='white'
						boxShadow='lg'
						_hover={{bgColor: 'blackAlpha.700'}}
						onClick={() => signin('github')}
						_focus={{outline: 'none'}}
					>
						Sign In With Github
					</Button>
				</Stack>
			</Center>
		</>
	);
};

export default Signin;
