

import React, { useState, useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import socket from '../../api/socket';

import { VideoCard, BottomBar } from './components';

import './Room.sass';


const Room = (props) => {
	// const currentUser = sessionStorage.getItem('user');
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

	function createUserVideo(peer, index, arr) {
		return (
			<div
				// className={`width-peer${peers.length > 8 ? '' : peers.length}`}
				className={classNames('Room__video', {
					'Room__video--big': peers.length < 3,
					'Room__video--small': peers.length > 6
				})}
				onClick={expandScreen}
				key={index}
			>
				
				{/* Это если видео скрыто */}
				{/* if (!userVideoAudio[userName].video) && <p className="Room__video-fullname">{peer.userName}</p> */}

				<p className="Room__video-fullname">{peer.userName}</p>
				
				<VideoCard key={index} peer={peer} number={arr.length} />
			</div>
		);
	}



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

	return (
		<main className="Page Room">
			<div className="container">
				<div className="Room__videocams">
					{/* Current User Video */}
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
						peers.map((peer, index, arr) => createUserVideo(peer, index, arr))}
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
