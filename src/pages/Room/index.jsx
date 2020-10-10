

import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import socket from '../../api/socket';

import { Button } from '../../components';
import { VideoCard, BottomBar, RoomInfo } from './components';
import useFullscreen from '../../helpers/useFullscreen';

import './Room.sass';


const UserVideo = ({ peers, peer, arr }) => {
	const ref = useRef();
	const {isFullscreen, handleFullscreen} = useFullscreen(ref);

	return (
		<div
			// className={`width-peer${peers.length > 8 ? '' : peers.length}`}
			className={classNames('Room__video', {
				'Room__video--big': peers.length < 3,
				'Room__video--small': peers.length > 6
			})}
			ref={ref}
		>
			
			{/* Это если видео скрыто */}
			{/* if (!userVideoAudio[userName].video) && <p className="Room__video-fullname">{peer.userName}</p> */}

			<p className="Room__video-fullname">{peer.userName}</p>

			<Button 
				className="Room__video-fullscreen"
				icon={ !isFullscreen 
					? <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path d="M7.09766 21.2031H2.69531C2.19991 21.2031 1.79688 20.8001 1.79688 20.3047V16.0371C1.79688 15.5409 1.39464 15.1387 0.898438 15.1387C0.40223 15.1387 0 15.5409 0 16.0371V20.3047C0 21.7909 1.20912 23 2.69531 23H7.09766C7.59386 23 7.99609 22.5978 7.99609 22.1016C7.99609 21.6054 7.59386 21.2031 7.09766 21.2031Z" fill="white" />
						<path d="M0.898438 7.90625C1.39464 7.90625 1.79688 7.50402 1.79688 7.00781V2.69531C1.79688 2.19991 2.19991 1.79688 2.69531 1.79688H7.09766C7.59386 1.79688 7.99609 1.39464 7.99609 0.898438C7.99609 0.40223 7.59386 0 7.09766 0H2.69531C1.20912 0 0 1.20912 0 2.69531V7.00781C0 7.50402 0.40223 7.90625 0.898438 7.90625Z" fill="white" />
						<path d="M20.3047 0H15.9023C15.4061 0 15.0039 0.40223 15.0039 0.898438C15.0039 1.39464 15.4061 1.79688 15.9023 1.79688H20.3047C20.8001 1.79688 21.2031 2.19991 21.2031 2.69531V7.00781C21.2031 7.50402 21.6054 7.90625 22.1016 7.90625C22.5978 7.90625 23 7.50402 23 7.00781V2.69531C23 1.20912 21.7909 0 20.3047 0Z" fill="white" />
						<path d="M22.1016 15.1387C21.6054 15.1387 21.2031 15.5409 21.2031 16.0371V20.3047C21.2031 20.8001 20.8001 21.2031 20.3047 21.2031H15.9023C15.4061 21.2031 15.0039 21.6054 15.0039 22.1016C15.0039 22.5978 15.4061 23 15.9023 23H20.3047C21.7909 23 23 21.7909 23 20.3047V16.0371C23 15.5409 22.5978 15.1387 22.1016 15.1387Z" fill="white" />
					</svg>
					: <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
						<g clipPath="url(#clip5)">
							<path d="M0.898438 16.9355L5.30078 16.9355C5.79618 16.9355 6.19922 17.3386 6.19922 17.834L6.19922 22.1016C6.19922 22.5978 6.60145 23 7.09766 23C7.59386 23 7.99609 22.5978 7.99609 22.1016L7.99609 17.834C7.99609 16.3478 6.78698 15.1387 5.30078 15.1387L0.898438 15.1387C0.402231 15.1387 6.52095e-07 15.5409 6.08715e-07 16.0371C5.65335e-07 16.5333 0.402231 16.9355 0.898438 16.9355Z" fill="white" />
							<path d="M7.09766 7.85439e-08C6.60145 1.21924e-07 6.19922 0.402231 6.19922 0.898438L6.19922 5.21094C6.19922 5.70634 5.79618 6.10938 5.30078 6.10938L0.898437 6.10938C0.40223 6.10938 -1.21924e-07 6.51161 -7.85439e-08 7.00781C-3.51641e-08 7.50402 0.40223 7.90625 0.898438 7.90625L5.30078 7.90625C6.78698 7.90625 7.99609 6.69713 7.99609 5.21094L7.99609 0.898438C7.99609 0.40223 7.59386 3.51641e-08 7.09766 7.85439e-08Z" fill="white" />
							<path d="M17.6992 7.90625L22.1016 7.90625C22.5978 7.90625 23 7.50402 23 7.00781C23 6.51161 22.5978 6.10937 22.1016 6.10937L17.6992 6.10937C17.2038 6.10937 16.8008 5.70634 16.8008 5.21094L16.8008 0.898437C16.8008 0.40223 16.3986 -5.77117e-07 15.9023 -6.20497e-07C15.4061 -6.63877e-07 15.0039 0.40223 15.0039 0.898437L15.0039 5.21094C15.0039 6.69713 16.213 7.90625 17.6992 7.90625Z" fill="white" />
							<path d="M15.9023 23C16.3986 23 16.8008 22.5978 16.8008 22.1016L16.8008 17.834C16.8008 17.3386 17.2038 16.9355 17.6992 16.9355L22.1016 16.9355C22.5978 16.9355 23 16.5333 23 16.0371C23 15.5409 22.5978 15.1387 22.1016 15.1387L17.6992 15.1387C16.213 15.1387 15.0039 16.3478 15.0039 17.834L15.0039 22.1016C15.0039 22.5978 15.4061 23 15.9023 23Z" fill="white" />
						</g>
						<defs>
							<clipPath id="clip5">
								<rect width="23" height="23" fill="white" />
							</clipPath>
						</defs>
					</svg>
				}
				onClick={handleFullscreen}
				// onClick={() => setIsFullscreen(!isFullscreen)} 
				// onClick={expandScreen} 
			/>
			
			{/* <VideoCard key={index} peer={peer} number={arr.length} /> */}
			<VideoCard peer={peer} number={arr.length} />
		</div>
	)
}


const Room = () => {
	const { curUser } = useSelector(state => state.users);
	const [peers, setPeers] = useState([]);
	const [userVideoAudio, setUserVideoAudio] = useState({
		localUser: { video: true, audio: true },
	});
	// const [displayChat, setDisplayChat] = useState(false);
	const [screenShare, setScreenShare] = useState(false);
	const peersRef = useRef([]);
	const userVideoRef = useRef();
	const screenTrackRef = useRef();
	const userStream = useRef();
	const { roomId } = useParams();

	// const [isFullscreen, setIsFullscreen] = useState(false);
	// const handleFullscreen = useFullScreenHandle();

	// const {isFullscreen, handleFullscreen} = useFullscreen(ref);


	useEffect(() => {
		// Set Back Button Event
		window.addEventListener('popstate', goToBack);

		// Connect Camera & Mic
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				userVideoRef.current.srcObject = stream;
				userStream.current = stream;

				socket.emit('BE-join-room', { roomId, userName: curUser.fullname });
				socket.on('FE-user-join', (users) => {
					// all users
					const peers = [];
					users.forEach(({ userId, info }) => {
						let { userName, video, audio } = info;

						if (userName !== curUser.fullname) {
							const peer = createPeer(userId, socket.id, stream);

							peer.userName = userName;
							peer.peerID = userId;

							peersRef.current.push({
								peerID: userId,
								peer,
								userName,
							});
							peers.push(peer);

							setUserVideoAudio((preList) => {
								return {
									...preList,
									[peer.userName]: { video, audio },
								};
							});
						}
					});

					setPeers(peers);
				});

				socket.on('FE-receive-call', ({ signal, from, info }) => {
					let { userName, video, audio } = info;
					const peerIdx = findPeer(from);

					if (!peerIdx) {
						const peer = addPeer(signal, from, stream);

						peer.userName = userName;

						peersRef.current.push({
							peerID: from,
							peer,
							userName: userName,
						});
						setPeers((users) => {
							return [...users, peer];
						});
						setUserVideoAudio((preList) => {
							return {
								...preList,
								[peer.userName]: { video, audio },
							};
						});
					}
				});

				socket.on('FE-call-accepted', ({ signal, answerId }) => {
					const peerIdx = findPeer(answerId);
					peerIdx.peer.signal(signal);
				});

				socket.on('FE-user-leave', ({ userId, userName }) => {
					const peerIdx = findPeer(userId);
					peerIdx.peer.destroy();
					setPeers((users) => {
						users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
						return [...users];
					});
				});
			});

		socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
			const peerIdx = findPeer(userId);

			setUserVideoAudio((preList) => {
				let video = preList[peerIdx.userName].video;
				let audio = preList[peerIdx.userName].audio;

				if (switchTarget === 'video') video = !video;
				else audio = !audio;

				return {
					...preList,
					[peerIdx.userName]: { video, audio },
				};
			});
		});

		return () => {
			socket.disconnect();
		};
		// eslint-disable-next-line
	}, []);

	function createPeer(userId, caller, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on('signal', (signal) => {
			socket.emit('BE-call-user', {
				userToCall: userId,
				from: caller,
				signal,
			});
		});
		peer.on('disconnect', () => {
			peer.destroy();
		});

		return peer;
	}

	function addPeer(incomingSignal, callerId, stream) {
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream,
		});

		peer.on('signal', (signal) => {
			socket.emit('BE-accept-call', { signal, to: callerId });
		});

		peer.on('disconnect', () => {
			peer.destroy();
		});

		peer.signal(incomingSignal);

		return peer;
	}

	function findPeer(id) {
		return peersRef.current.find((p) => p.peerID === id);
	}

	// Вынести в отдельный компонент
	// function createUserVideo(peer, index, arr) {
	// 	return (
	// 		<div
	// 			// className={`width-peer${peers.length > 8 ? '' : peers.length}`}
	// 			className={classNames('Room__video', {
	// 				'Room__video--big': peers.length < 3,
	// 				'Room__video--small': peers.length > 6
	// 			})}
	// 			// onClick={expandScreen}
	// 			key={index}
	// 		>
				
	// 			{/* Это если видео скрыто */}
	// 			{/* if (!userVideoAudio[userName].video) && <p className="Room__video-fullname">{peer.userName}</p> */}

	// 			<p className="Room__video-fullname">{peer.userName}</p>

	// 			<Button 
	// 				className="Room__video-fullscreen"
	// 				icon={
	// 					<svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
	// 						<path d="M7.09766 21.2031H2.69531C2.19991 21.2031 1.79688 20.8001 1.79688 20.3047V16.0371C1.79688 15.5409 1.39464 15.1387 0.898438 15.1387C0.40223 15.1387 0 15.5409 0 16.0371V20.3047C0 21.7909 1.20912 23 2.69531 23H7.09766C7.59386 23 7.99609 22.5978 7.99609 22.1016C7.99609 21.6054 7.59386 21.2031 7.09766 21.2031Z" fill="white" />
	// 						<path d="M0.898438 7.90625C1.39464 7.90625 1.79688 7.50402 1.79688 7.00781V2.69531C1.79688 2.19991 2.19991 1.79688 2.69531 1.79688H7.09766C7.59386 1.79688 7.99609 1.39464 7.99609 0.898438C7.99609 0.40223 7.59386 0 7.09766 0H2.69531C1.20912 0 0 1.20912 0 2.69531V7.00781C0 7.50402 0.40223 7.90625 0.898438 7.90625Z" fill="white" />
	// 						<path d="M20.3047 0H15.9023C15.4061 0 15.0039 0.40223 15.0039 0.898438C15.0039 1.39464 15.4061 1.79688 15.9023 1.79688H20.3047C20.8001 1.79688 21.2031 2.19991 21.2031 2.69531V7.00781C21.2031 7.50402 21.6054 7.90625 22.1016 7.90625C22.5978 7.90625 23 7.50402 23 7.00781V2.69531C23 1.20912 21.7909 0 20.3047 0Z" fill="white" />
	// 						<path d="M22.1016 15.1387C21.6054 15.1387 21.2031 15.5409 21.2031 16.0371V20.3047C21.2031 20.8001 20.8001 21.2031 20.3047 21.2031H15.9023C15.4061 21.2031 15.0039 21.6054 15.0039 22.1016C15.0039 22.5978 15.4061 23 15.9023 23H20.3047C21.7909 23 23 21.7909 23 20.3047V16.0371C23 15.5409 22.5978 15.1387 22.1016 15.1387Z" fill="white" />
	// 					</svg>

	// 				}
	// 				// onClick={handleFullscreen.enter}
	// 				// onClick={() => setIsFullscreen(!isFullscreen)} 
	// 				onClick={expandScreen} 
	// 			/>
				
	// 			<VideoCard key={index} peer={peer} number={arr.length} />
	// 		</div>
	// 	);
	// }



	// // Open Chat
	// const clickChat = (e) => {
	// 	e.stopPropagation();
	// 	setDisplayChat(!displayChat);
	// };

	// BackButton
	const goToBack = (e) => {
		e.preventDefault();
		socket.emit('BE-leave-room', { roomId, leaver: curUser.fullname });
		// sessionStorage.removeItem('user');
		// window.location.href = '/';
	};

	const toggleCameraAudio = (switchType) => {
		// const target = e.target.getAttribute('data-switch');

		setUserVideoAudio((preList) => {
			let videoSwitch = preList['localUser'].video;
			let audioSwitch = preList['localUser'].audio;

			if (switchType === 'video') {
				const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
				videoSwitch = !videoSwitch;
				userVideoTrack.enabled = videoSwitch;
			} else {
				const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
				audioSwitch = !audioSwitch;

				if (userAudioTrack) {
					userAudioTrack.enabled = audioSwitch;
				} else {
					userStream.current.getAudioTracks()[0].enabled = audioSwitch;
				}
			}

			return {
				...preList,
				localUser: { video: videoSwitch, audio: audioSwitch },
			};
		});

		socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: switchType });
	};

	const clickScreenSharing = () => {
		if (!screenShare) {
			navigator.mediaDevices
				.getDisplayMedia({ cursor: true })
				.then((stream) => {
					const screenTrack = stream.getTracks()[0];

					peersRef.current.forEach(({ peer }) => {
						// replaceTrack (oldTrack, newTrack, oldStream);
						peer.replaceTrack(
							peer.streams[0]
								.getTracks()
								.find((track) => track.kind === 'video'),
							screenTrack,
							userStream.current
						);
					});

					// Listen click end
					screenTrack.onended = () => {
						peersRef.current.forEach(({ peer }) => {
							peer.replaceTrack(
								screenTrack,
								peer.streams[0]
									.getTracks()
									.find((track) => track.kind === 'video'),
								userStream.current
							);
						});
						userVideoRef.current.srcObject = userStream.current;
						setScreenShare(false);
					};

					userVideoRef.current.srcObject = stream;
					screenTrackRef.current = screenTrack;
					setScreenShare(true);
				});
		} else {
			screenTrackRef.current.onended();
		}
	};

	// TODO: Вынести эту штуку в видео компонент
	const expandScreen = (e) => {
		const elem = e.target;

		if (elem.requestFullscreen) {
			elem.requestFullscreen();
		} else if (elem.mozRequestFullScreen) {
			/* Firefox */
			elem.mozRequestFullScreen();
		} else if (elem.webkitRequestFullscreen) {
			/* Chrome, Safari & Opera */
			elem.webkitRequestFullscreen();
		} else if (elem.msRequestFullscreen) {
			/* IE/Edge */
			elem.msRequestFullscreen();
		}
	};

	// const expandScreen = (e) => {
	// 	const elem = e.target;

	// 	if (!isFullscreen) {
	// 		if (elem.requestFullscreen) {
	// 			elem.requestFullscreen();
	// 		} else if (elem.mozRequestFullScreen) {
	// 			/* Firefox */
	// 			elem.mozRequestFullScreen();
	// 		} else if (elem.webkitRequestFullscreen) {
	// 			/* Chrome, Safari & Opera */
	// 			elem.webkitRequestFullscreen();
	// 		} else if (elem.msRequestFullscreen) {
	// 			/* IE/Edge */
	// 			elem.msRequestFullscreen();
	// 		}
	// 	} else {
	// 		document.exitFullscreen();
	// 	}

	// 	setIsFullscreen(!isFullscreen);
	// };

	return (
		<main className="Page Room">
			<div className="container">
				<RoomInfo roomId={roomId} />

				<div className="Room__videocams">
					{/* Current User Video */}
					{/* Вынести в отдельный компонент */}
					<div
						// className={`width-peer${peers.length > 8 ? '' : peers.length}`}
						className={classNames('Room__video Room__video--my', {
							'Room__video--big': peers.length < 3,
							'Room__video--small': peers.length > 6
						})}
						onClick={expandScreen}
					>
						{/* Показывается, когда видео скрыто */}
						{/* {userVideoAudio['localUser'].video ? null : (
							<p>{curUser.fullname}</p>
						)} */}

						<p className="Room__video-fullname">{curUser.fullname}</p>

						<video
							// onClick={expandScreen}
							ref={userVideoRef}
							muted
							autoPlay
							playsInline={true}
						></video>
					</div>

					{/* Joined Users Video */}
					{peers &&
						// peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
						peers.map((peer, index, arr) => (
							<UserVideo 
								key={index}
								peer={peer}
								peers={peers}
								arr={arr}
							/>
						))}
				</div>
		
		
			</div>

			<BottomBar
				clickScreenSharing={clickScreenSharing}
				// clickChat={clickChat}
				goToBack={goToBack}
				toggleCameraAudio={toggleCameraAudio}
				userVideoAudio={userVideoAudio['localUser']}
				screenShare={screenShare}
			/>

		</main>
	);
};

export default Room;





























// import React, { useState, useEffect, useRef } from 'react';
// import Peer from 'simple-peer';
// import socket from '../../api/socket';
// import { useParams } from 'react-router-dom';
// import { useSelector } from 'react-redux';

// const VideoCard = (props) => {
// 	const ref = useRef();
// 	const peer = props.peer;

// 	useEffect(() => {
// 		peer.on('stream', (stream) => {
// 			ref.current.srcObject = stream;
// 		});
// 		peer.on('track', (track, stream) => {
// 		});
// 	}, [peer]);

// 	return (
// 		<video
// 			playsInline={true}
// 			autoPlay
// 			ref={ref}
// 		></video>
// 	);
// };


// const Room = (props) => {
// 	// const currentUser = sessionStorage.getItem('user');
// 	const { curUser } = useSelector(state => state.users);
// 	const [peers, setPeers] = useState([]);
// 	const [userVideoAudio, setUserVideoAudio] = useState({
// 		localUser: { video: true, audio: true },
// 	});
// 	// const [displayChat, setDisplayChat] = useState(false);
// 	// const [screenShare, setScreenShare] = useState(false);
// 	const peersRef = useRef([]);
// 	const userVideoRef = useRef();
// 	// const screenTrackRef = useRef();
// 	const userStream = useRef();
// 	const { roomId } = useParams();

// 	useEffect(() => {
// 		// Set Back Button Event
// 		window.addEventListener('popstate', goToBack);

// 		// Connect Camera & Mic
// 		navigator.mediaDevices
// 			.getUserMedia({ video: true, audio: true })
// 			.then((stream) => {
// 				userVideoRef.current.srcObject = stream;
// 				userStream.current = stream;

// 				socket.emit('BE-join-room', { roomId, userName: curUser.fullname });
// 				socket.on('FE-user-join', (users) => {
// 					// all users
// 					const peers = [];
// 					users.forEach(({ userId, info }) => {
// 						let { userName, video, audio } = info;

// 						if (userName !== curUser.fullname) {
// 							const peer = createPeer(userId, socket.id, stream);

// 							peer.userName = userName;
// 							peer.peerID = userId;

// 							peersRef.current.push({
// 								peerID: userId,
// 								peer,
// 								userName,
// 							});
// 							peers.push(peer);

// 							setUserVideoAudio((preList) => {
// 								return {
// 									...preList,
// 									[peer.userName]: { video, audio },
// 								};
// 							});
// 						}
// 					});

// 					setPeers(peers);
// 				});

// 				socket.on('FE-receive-call', ({ signal, from, info }) => {
// 					let { userName, video, audio } = info;
// 					const peerIdx = findPeer(from);

// 					if (!peerIdx) {
// 						const peer = addPeer(signal, from, stream);

// 						peer.userName = userName;

// 						peersRef.current.push({
// 							peerID: from,
// 							peer,
// 							userName: userName,
// 						});
// 						setPeers((users) => {
// 							return [...users, peer];
// 						});
// 						setUserVideoAudio((preList) => {
// 							return {
// 								...preList,
// 								[peer.userName]: { video, audio },
// 							};
// 						});
// 					}
// 				});

// 				socket.on('FE-call-accepted', ({ signal, answerId }) => {
// 					const peerIdx = findPeer(answerId);
// 					peerIdx.peer.signal(signal);
// 				});

// 				socket.on('FE-user-leave', ({ userId, userName }) => {
// 					const peerIdx = findPeer(userId);
// 					peerIdx.peer.destroy();
// 					setPeers((users) => {
// 						users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
// 						return [...users];
// 					});
// 				});
// 			});

// 		socket.on('FE-toggle-camera', ({ userId, switchTarget }) => {
// 			const peerIdx = findPeer(userId);

// 			setUserVideoAudio((preList) => {
// 				let video = preList[peerIdx.userName].video;
// 				let audio = preList[peerIdx.userName].audio;

// 				if (switchTarget === 'video') video = !video;
// 				else audio = !audio;

// 				return {
// 					...preList,
// 					[peerIdx.userName]: { video, audio },
// 				};
// 			});
// 		});

// 		return () => {
// 			socket.disconnect();
// 		};
// 		// eslint-disable-next-line
// 	}, []);

// 	function createPeer(userId, caller, stream) {
// 		const peer = new Peer({
// 			initiator: true,
// 			trickle: false,
// 			stream,
// 		});

// 		peer.on('signal', (signal) => {
// 			socket.emit('BE-call-user', {
// 				userToCall: userId,
// 				from: caller,
// 				signal,
// 			});
// 		});
// 		peer.on('disconnect', () => {
// 			peer.destroy();
// 		});

// 		return peer;
// 	}

// 	function addPeer(incomingSignal, callerId, stream) {
// 		const peer = new Peer({
// 			initiator: false,
// 			trickle: false,
// 			stream,
// 		});

// 		peer.on('signal', (signal) => {
// 			socket.emit('BE-accept-call', { signal, to: callerId });
// 		});

// 		peer.on('disconnect', () => {
// 			peer.destroy();
// 		});

// 		peer.signal(incomingSignal);

// 		return peer;
// 	}

// 	function findPeer(id) {
// 		return peersRef.current.find((p) => p.peerID === id);
// 	}

// 	function createUserVideo(peer, index, arr) {
// 		return (
// 			<div
// 				className={`width-peer${peers.length > 8 ? '' : peers.length}`}
// 				onClick={expandScreen}
// 				key={index}
// 			>
// 				{writeUserName(peer.userName)}
// 				<VideoCard key={index} peer={peer} number={arr.length} />
// 			</div>
// 		);
// 	}

// 	function writeUserName(userName, index) {
// 		if (userVideoAudio.hasOwnProperty(userName)) {
// 			if (!userVideoAudio[userName].video) {
// 				return <div key={userName}>{userName}</div>;
// 			}
// 		}
// 	}

// 	// // Open Chat
// 	// const clickChat = (e) => {
// 	// 	e.stopPropagation();
// 	// 	setDisplayChat(!displayChat);
// 	// };

// 	// BackButton
// 	const goToBack = (e) => {
// 		e.preventDefault();
// 		socket.emit('BE-leave-room', { roomId, leaver: curUser.fullname });
// 		// sessionStorage.removeItem('user');
// 		// window.location.href = '/';
// 	};

// 	// const toggleCameraAudio = (e) => {
// 	// 	const target = e.target.getAttribute('data-switch');

// 	// 	setUserVideoAudio((preList) => {
// 	// 		let videoSwitch = preList['localUser'].video;
// 	// 		let audioSwitch = preList['localUser'].audio;

// 	// 		if (target === 'video') {
// 	// 			const userVideoTrack = userVideoRef.current.srcObject.getVideoTracks()[0];
// 	// 			videoSwitch = !videoSwitch;
// 	// 			userVideoTrack.enabled = videoSwitch;
// 	// 		} else {
// 	// 			const userAudioTrack = userVideoRef.current.srcObject.getAudioTracks()[0];
// 	// 			audioSwitch = !audioSwitch;

// 	// 			if (userAudioTrack) {
// 	// 				userAudioTrack.enabled = audioSwitch;
// 	// 			} else {
// 	// 				userStream.current.getAudioTracks()[0].enabled = audioSwitch;
// 	// 			}
// 	// 		}

// 	// 		return {
// 	// 			...preList,
// 	// 			localUser: { video: videoSwitch, audio: audioSwitch },
// 	// 		};
// 	// 	});

// 	// 	socket.emit('BE-toggle-camera-audio', { roomId, switchTarget: target });
// 	// };

// 	// const clickScreenSharing = () => {
// 	// 	if (!screenShare) {
// 	// 		navigator.mediaDevices
// 	// 			.getDisplayMedia({ cursor: true })
// 	// 			.then((stream) => {
// 	// 				const screenTrack = stream.getTracks()[0];

// 	// 				peersRef.current.forEach(({ peer }) => {
// 	// 					// replaceTrack (oldTrack, newTrack, oldStream);
// 	// 					peer.replaceTrack(
// 	// 						peer.streams[0]
// 	// 							.getTracks()
// 	// 							.find((track) => track.kind === 'video'),
// 	// 						screenTrack,
// 	// 						userStream.current
// 	// 					);
// 	// 				});

// 	// 				// Listen click end
// 	// 				screenTrack.onended = () => {
// 	// 					peersRef.current.forEach(({ peer }) => {
// 	// 						peer.replaceTrack(
// 	// 							screenTrack,
// 	// 							peer.streams[0]
// 	// 								.getTracks()
// 	// 								.find((track) => track.kind === 'video'),
// 	// 							userStream.current
// 	// 						);
// 	// 					});
// 	// 					userVideoRef.current.srcObject = userStream.current;
// 	// 					setScreenShare(false);
// 	// 				};

// 	// 				userVideoRef.current.srcObject = stream;
// 	// 				screenTrackRef.current = screenTrack;
// 	// 				setScreenShare(true);
// 	// 			});
// 	// 	} else {
// 	// 		screenTrackRef.current.onended();
// 	// 	}
// 	// };

// 	const expandScreen = (e) => {
// 		const elem = e.target;

// 		if (elem.requestFullscreen) {
// 			elem.requestFullscreen();
// 		} else if (elem.mozRequestFullScreen) {
// 			/* Firefox */
// 			elem.mozRequestFullScreen();
// 		} else if (elem.webkitRequestFullscreen) {
// 			/* Chrome, Safari & Opera */
// 			elem.webkitRequestFullscreen();
// 		} else if (elem.msRequestFullscreen) {
// 			/* IE/Edge */
// 			elem.msRequestFullscreen();
// 		}
// 	};

// 	return (
// 		<div>
// 			<div>
// 				{/* Current User Video */}
// 				<div
// 					className={`width-peer${peers.length > 8 ? '' : peers.length}`}
// 				>
// 					{userVideoAudio['localUser'].video ? null : (
// 						<p>{curUser.fullname}</p>
// 					)}

// 					<video
// 						onClick={expandScreen}
// 						ref={userVideoRef}
// 						muted
// 						autoPlay
// 						playsInline={true}
// 					></video>
// 				</div>
// 				{/* Joined User Video */}
// 				{peers &&
// 					peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
// 			</div>

// 		</div>
// 	);
// };


// export default Room;



























// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import Peer from "simple-peer";
// import { useParams } from 'react-router-dom';


// const Video = (props) => {
//     const ref = useRef();

//     useEffect(() => {
//         props.peer.on("stream", stream => {
//             ref.current.srcObject = stream;
//             // ref.current.src = window.URL.createObjectURL(stream) // for older browsers


//         })
//     }, [props.peer]);

//     return (
//         <video autoPlay ref={ref}></video>
//     );
// }


// const Room = (props) => {
//     const [peers, setPeers] = useState([]);
//     const socketRef = useRef();
//     const userVideo = useRef();
//     const peersRef = useRef([]);
//     const { roomId } = useParams();

//     useEffect(() => {
//         socketRef.current = io.connect("/");
//         // navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {

//         navigator.mediaDevices.getUserMedia({ 
//         // navigator.getUserMedia({ 
//             video: {width: 300, height: 240}, 
//             // video: true, 
//             audio: true 
//         }).then(stream => {
//             userVideo.current.srcObject = stream;
//             // userVideo.current.src = window.URL.createObjectURL(stream) // for older browsers

//             console.log(userVideo)

//             console.log('userVideo', userVideo)

//             socketRef.current.emit("join room", roomId);
//             socketRef.current.on("all users", users => {
//                 const peers = [];
//                 users.forEach(userID => {
//                     const peer = createPeer(userID, socketRef.current.id, stream);
//                     peersRef.current.push({
//                         peerID: userID,
//                         peer,
//                     })
//                     peers.push(peer);
//                 })
//                 setPeers(peers);
//             })

//             socketRef.current.on("user joined", payload => {
//                 const peer = addPeer(payload.signal, payload.callerID, stream);
//                 peersRef.current.push({
//                     peerID: payload.callerID,
//                     peer,
//                 })

//                 setPeers(users => [...users, peer]);
//             });

//             socketRef.current.on("receiving returned signal", payload => {
//                 const item = peersRef.current.find(p => p.peerID === payload.id);
//                 item.peer.signal(payload.signal);
//             });
//         })
// //     }, [roomId]);
//     }, []);

//     function createPeer(userToSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: true,
//             trickle: false,
//             stream,
//         });

//         peer.on("signal", signal => {
//             socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
//         })

//         return peer;
//     }

//     function addPeer(incomingSignal, callerID, stream) {
//         const peer = new Peer({
//             initiator: false,
//             trickle: false,
//             stream,
//         })

//         peer.on("signal", signal => {
//             socketRef.current.emit("returning signal", { signal, callerID })
//         })

//         peer.signal(incomingSignal);

//         return peer;
//     }

//     return (
//         <main>
//             <video muted ref={userVideo} autoPlay></video>
//             {peers.length && peers.map((peer, index) => {
//                 console.log('peer', peer)
//                 return (
//                     <Video key={index} peer={peer} />
//                 );
//             })}
//         </main>
//     );
// };

// export default Room;


























// Текущая рабочая версия

// import React, { useEffect, memo, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector, connect } from 'react-redux';
// import Peer from 'peerjs';

// import socket from '../../api/socket';
// import { roomsActions } from '../../store/actions';

// // const myPeer = new Peer(undefined, {
// // 	path: '/peerjs',
// // 	host: 'localhost',
// // 	port: '8080'
// // })

// const VideoCam = ({ stream }) => {
// 	const ref = useRef();

// 	useEffect(() => {
// 		ref.current.srcObject = stream;
// 	}, [])

// 	return (
// 		<div>
// 			<p>{  }</p>
// 			<video ref={ref} muted autoPlay width={300} height={240}></video>
// 		</div>
// 	)
// }

// let peers = {}

// const Room = ({ fetchCurrentRoom, setCurrentRoomUsers, addNewUserToRoom, removeUserFromRoom }) => {
// 	const { roomId } = useParams();
// 	const { curUser } = useSelector(state => state.users);
// 	const { currentRoom } = useSelector(state => state.rooms);

// 	let myVideoStream = useRef();
// 	const [videos, setVideos] = useState([]);
	
// 	// let peers = useRef({});
// 	const myPeer = useRef(new Peer(undefined, {
// 		path: '/peerjs',
// 		// path: '/',
// 		host: 'localhost',
// 		// host: 'http://localhost',
// 		// port: '443'
// 		port: '8080'
// 	}))

// 	console.log('ROOM RENDER')

// 	useEffect(() => {
// 		socket.on('user-disconnected', userId => {
// 			if (peers[userId]) peers[userId].close()
// 		})
		
// 		myPeer.current.on('open', id => {
// 			socket.emit('join-room', roomId, id)
// 		})
// 	})

// 	useEffect(() => {	
// 		navigator.mediaDevices.getUserMedia({
// 			video: true,
// 			audio: true
// 		}).then(stream => {
// 			myVideoStream.current.srcObject = stream;
			
// 			myPeer.current.on('call', call => {
// 				call.answer(stream)
		
// 				call.on('stream', userVideoStream => {
// 					addVideoStream(userVideoStream)
// 				})
// 			})
			
// 			socket.on('user-connected', userId => {
// 				console.log('user-connected', userId)
// 				connectToNewUser(userId, stream)
// 			})
			
// 		})

// 	}, [])

// 	function addVideoStream(stream) {
// 		setVideos([ ...videos, stream ])
// 	}

// 	function connectToNewUser(userId, stream) {
// 		const call = myPeer.current.call(userId, stream)

// 		call.on('stream', userVideoStream => {
// 			addVideoStream(userVideoStream)
// 		})
// 		// call.on('close', () => {
// 		// 	video.remove()
// 		// })

// 		console.log('userId', userId)
// 		peers[userId] = call
// 	}


// 	return (
// 		<main className="Page Room">
// 			<div className="container">
// 				<div className="box">
// 					<h1 className="title title--big">Название конференции</h1>
// 				</div>

// 				<div className="videos">
// 					<video ref={myVideoStream} muted autoPlay width={300} height={240}></video>

// 					{ videos && videos.length &&
// 						videos.map((stream, i) => (
// 							<VideoCam 
// 								key={i + Date.now()}
// 								stream={stream}
// 							/>
// 						))
// 					}
// 				</div>
// 			</div>
// 		</main>
// 	)
// }

// export default connect(
// 	null,
// 	{
// 		fetchCurrentRoom: roomsActions.fetchCurrentRoom,
// 		setCurrentRoomUsers: roomsActions.setCurrentRoomUsers,
// 		addNewUserToRoom: roomsActions.addNewUserToRoom,
// 		removeUserFromRoom: roomsActions.removeUserFromRoom,
// 	}
// )(Room)



































// import React, { useEffect, memo } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector, connect } from 'react-redux';

// import socket from '../../api/socket';
// import { roomsActions } from '../../store/actions';

// const Room = memo(({ fetchCurrentRoom, setCurrentRoomUsers, addNewUserToRoom, removeUserFromRoom }) => {
// 	const { roomId } = useParams();
// 	const { curUser } = useSelector(state => state.users);
// 	const { currentRoom } = useSelector(state => state.rooms);

// 	console.log('ROOM RENDER')

// 	// useEffect(() => {
// 	// 	!currentRoom && roomId && fetchCurrentRoom(roomId);
// 	// }, [currentRoom, roomId, fetchCurrentRoom])

// 	useEffect(() => {
// 		// Входим в комнату roomId
// 		if (roomId) {
// 			socket.emit("ROOM:JOIN", { roomId: roomId, userId: curUser._id, fullname: curUser.fullname }, (data) => console.log(data))
// 		}
// 	}, [roomId, curUser])

// 	useEffect(() => {
// 		socket.on('ROOM:USERS_INFO', data => {
// 			console.log('Пользователей в комнате', data)
// 			setCurrentRoomUsers(data.users)
// 		})
// 	}, [setCurrentRoomUsers])

// 	useEffect(() => {
// 		socket.on('ROOM:NEW_USER', user => {
// 			console.log('Новый пользователь', user)
// 			addNewUserToRoom(user);
// 		});

// 		socket.on('ROOM:REMOVE_USER', user => {
// 			console.log('Пользователь вышел', user)
// 			removeUserFromRoom(user);
// 		});
// 	}, [addNewUserToRoom, removeUserFromRoom])

// 	useEffect(() => {
// 		return () => {
// 			socket.emit("ROOM:LEAVE", curUser._id);
// 			socket.off('ROOM:USERS_INFO');		// ВАЖНО: отключаю обработчик (иначе каждый раз будет всё больше и больше)
// 			socket.off('ROOM:NEW_USER');		
// 			socket.off('ROOM:REMOVE_USER');		
// 		}
// 	}, [curUser])

// 	return (
// 		<main className="Page Room">
// 			<div className="container">
// 				<div className="box">
// 					<h1 className="title title--big">Название конференции</h1>
// 				</div>


// 			</div>
// 		</main>
// 	)
// })

// export default connect(
// 	null,
// 	{
// 		fetchCurrentRoom: roomsActions.fetchCurrentRoom,
// 		setCurrentRoomUsers: roomsActions.setCurrentRoomUsers,
// 		addNewUserToRoom: roomsActions.addNewUserToRoom,
// 		removeUserFromRoom: roomsActions.removeUserFromRoom,
// 	}
// )(Room)
