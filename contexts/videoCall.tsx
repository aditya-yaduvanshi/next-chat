import {
	collection,
	doc,
	addDoc,
	onSnapshot,
	getDoc,
	updateDoc,
} from 'firebase/firestore';
import {useRouter} from 'next/router';
import React, {
	createContext,
	PropsWithChildren,
	useContext,
	useEffect,
	useRef,
	useState,
} from 'react';
import {useAuthState} from 'react-firebase-hooks/auth';
import {useDocument} from 'react-firebase-hooks/firestore';
import {auth, db} from '../firebaseconfig';

export interface IVideoCallContext {
	localVideoRef: React.RefObject<HTMLVideoElement>;
	remoteVideoRef: React.RefObject<HTMLVideoElement>;
	joinVideoCall: () => void;
	endVideoCall: () => void;
	videoCallId: string;
}

export const VideoCallContext = createContext<IVideoCallContext | null>(null);

export const useVideoCall = () => {
	return useContext(VideoCallContext) as IVideoCallContext;
};

export const VideoCallProvider: React.FC<PropsWithChildren<{}>> = ({
	children,
}) => {
	const [user] = useAuthState(auth);
	const localVideoRef = useRef() as React.RefObject<HTMLVideoElement>;
	const remoteVideoRef = useRef() as React.RefObject<HTMLVideoElement>;
	const [peer, setPeer] = useState<RTCPeerConnection | null>(null);
	const router = useRouter();
	const videoCallId = router.pathname.split('/')[1];
	const videoDoc = doc(db, 'videos', videoCallId);
	
	const offerCandidates = collection(
		db,
		'videos',
		videoDoc.id,
		'offerCandidates'
	);
	const answerCandidates = collection(
		db,
		'videos',
		videoDoc.id,
		'answerCandidates'
	);

	const joinVideoCall: IVideoCallContext['joinVideoCall'] = async () => {
		const peer = new RTCPeerConnection({
			iceCandidatePoolSize: 10,
			iceServers: [
				{
					urls: [
						'stun:stun1.l.google.com:19302',
						'stun:stun2.l.google.com:19302',
					],
				},
			],
		});

		navigator.mediaDevices
			.getUserMedia({audio: true, video: true})
			.then((localStream) => {
				localStream.getTracks().forEach((track) => {
					peer.addTrack(track, localStream);
				});
				if (localVideoRef.current)
					localVideoRef.current.srcObject = localStream;
			});

		const remoteStream = new MediaStream();

		peer.ontrack = ({streams}) => {
			streams[0].getTracks().forEach((track) => {
				console.log(track)
				remoteStream.addTrack(track);
			});
		};

		if (remoteVideoRef.current) remoteVideoRef.current.srcObject = remoteStream;

		setPeer(peer);

		const videoCall = await getDoc(videoDoc);

		if (videoCall.get('createdBy') !== user?.uid) {
			peer.onicecandidate = async ({candidate}) => {
				candidate && (await addDoc(answerCandidates, candidate.toJSON()));
			};

			videoCall.data() &&
					peer.setRemoteDescription(new RTCSessionDescription(videoCall.get('offer')));

			peer.createAnswer().then(async (answerDescription) => {
				peer.setLocalDescription(answerDescription);
				await updateDoc(videoDoc, {answer: answerDescription});
			});

			onSnapshot(offerCandidates, (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						const candidate = new RTCIceCandidate(change.doc.data());
						peer.addIceCandidate(candidate);
					}
				});
			});
		} else {
			peer.onicecandidate = async ({candidate}) => {
				candidate && (await addDoc(offerCandidates, candidate.toJSON()));
			};

			peer.createOffer().then(async (offerDescription) => {
				peer.setLocalDescription(offerDescription);
				await updateDoc(videoDoc, {offer: offerDescription});
			});

			onSnapshot(videoDoc, (snapshot) => {
				const data = snapshot.data();
				if (!peer.currentRemoteDescription && data?.answer) {
					const answerDescription = new RTCSessionDescription(data.answer);
					peer.setRemoteDescription(answerDescription);
				}
			});

			onSnapshot(answerCandidates, (snapshot) => {
				snapshot.docChanges().forEach((change) => {
					if (change.type === 'added') {
						const candidate = new RTCIceCandidate(change.doc.data());
						peer.addIceCandidate(candidate);
					}
				});
			});
		}
	};

	const endVideoCall: IVideoCallContext['endVideoCall'] = () => {
		if (!peer) return;
		updateDoc(videoDoc, {ended: true}).then((_) => {
			peer.close();
			router.back();
		}).catch(err => console.log(err));
	};

	return (
		<VideoCallContext.Provider
			value={{
				localVideoRef,
				remoteVideoRef,
				joinVideoCall,
				endVideoCall,
				videoCallId,
			}}
		>
			{children}
		</VideoCallContext.Provider>
	);
};
