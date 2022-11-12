import {
	Button,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalHeader,
	ModalOverlay,
} from '@chakra-ui/react';
import React from 'react';

type CallModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
};

const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  onAccept
}): JSX.Element => {

	return (
		<>
			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent pb='5'>
					<ModalHeader>Someone is Calling...</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<Flex
							overflowY='auto'
							justifyContent='space-between'
							
							p='2'
							scrollBehavior='smooth'
						>
							<Button onClick={onClose}>Reject</Button>
              <Button onClick={onAccept}>Accept</Button>
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default React.memo(CallModal);
