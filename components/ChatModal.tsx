import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalCloseButton,
	useDisclosure,
  Flex
} from '@chakra-ui/react';
import React from 'react';
import {IModalProps} from './ContactModal';
import Contacts from './Contacts';

const ChatModal: React.FC<IModalProps> = ({children}): JSX.Element => {
	const {isOpen, onClose, onOpen} = useDisclosure();

	return (
		<>
			{React.cloneElement(children, {onClick: onOpen})}
			<Modal
				isOpen={isOpen}
				onClose={onClose}
			>
				<ModalOverlay />
				<ModalContent pb="5">
					<ModalHeader>Choose Contact To Chat</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
            <Flex overflowY='auto' direction='column' py='2' scrollBehavior='smooth'>
              <Contacts contactChooser />
            </Flex>
          </ModalBody>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ChatModal;
