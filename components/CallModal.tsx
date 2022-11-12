import {
	Avatar,
	Button,
	Flex,
	Modal,
	ModalBody,
	Text,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

type CallModalProps = {
	isOpen: boolean;
	onReject: () => void;
	onAccept: () => void;
	avatar?: string;
	username?: string;
};

const CallModal: React.FC<CallModalProps> = ({
	isOpen,
	onReject,
	onAccept,
	username,
	avatar,
}): JSX.Element => {
	return (
		<>
			<Modal isOpen={isOpen} onClose={() => {}}>
				<ModalOverlay />
				<ModalContent pb='5'>
					<ModalHeader>Incoming...</ModalHeader>
					<ModalBody>
						<Flex
							overflowY='auto'
							direction='column'
							p='2'
							scrollBehavior='smooth'
							gap='5'
						>
							<Flex
								justifyContent='center'
								direction='column'
								alignItems='center'
							>
								<Avatar src={avatar ?? ''} size='2xl' />
								<Text fontSize='large'>{username ?? 'Unknown'}</Text>
							</Flex>
							<Flex justifyContent='space-between' gap='3'>
								<Button
									onClick={onReject}
									variant='solid'
									bgColor='red.500'
									w='full'
									color='white'
									_hover={{bgColor: 'red.300'}}
								>
									Reject
								</Button>
								<Button
									onClick={onAccept}
									variant='solid'
									bgColor='green.500'
									w='full'
									color='white'
									_hover={{bgColor: 'green.300'}}
								>
									Accept
								</Button>
							</Flex>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default React.memo(CallModal);
