import { CloseIcon } from '@chakra-ui/icons';
import {Flex, IconButton} from '@chakra-ui/react';
import React, { useEffect } from 'react';
import {useVideoCall} from '../contexts/videoCall';

const VideoPlayer = () => {
	const {localVideoRef, remoteVideoRef, endVideoCall, joinVideoCall} = useVideoCall();
  useEffect(() => {
    joinVideoCall();
  }, []);
	return (
		<>
			<Flex>
				<video
					ref={localVideoRef}
					autoPlay
					muted
					width={480}
					height={360}
				></video>
				<video ref={remoteVideoRef} autoPlay width={480} height={360}></video>
				<Flex>
					<IconButton
						icon={<CloseIcon />}
            onClick={endVideoCall}
						aria-label='Close Call'
						bgColor='red.500'
						color='white'
						border='1px solid gray'
						_hover={{color: 'gray', bgColor: 'red.100'}}
					>End</IconButton>
				</Flex>
			</Flex>
		</>
	);
};

export default React.memo(VideoPlayer);
