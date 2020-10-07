
import React, { useEffect, memo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, connect } from 'react-redux';
import Peer from 'peerjs';

import socket from '../../api/socket';
import { roomsActions } from '../../store/actions';

// const myPeer = new Peer(undefined, {
// 	path: '/peerjs',
// 	host: 'localhost',
// 	port: '8080'
// })

const VideoCam = ({ stream }) => {
	const ref = useRef();

	useEffect(() => {
		ref.current.srcObject = stream;
	}, [])

	return (
		<div>
			<p>{  }</p>
			<video ref={ref} muted autoPlay width={300} height={240}></video>
		</div>
	)
}

const Room = ({ fetchCurrentRoom, setCurrentRoomUsers, addNewUserToRoom, removeUserFromRoom }) => {
	const { roomId } = useParams();
	const { curUser } = useSelector(state => state.users);
	const { currentRoom } = useSelector(state => state.rooms);

	let myVideoStream = useRef();
	const [peers, setPeers] = useState([]);
	const [videos, setVideos] = useState([]);

	const myPeer = useRef(new Peer(undefined, {
		path: '/peerjs',
		// path: '/',
		host: 'localhost',
		// host: 'http://localhost',
		// port: '443'
		port: '8080'
	}))

	console.log('ROOM RENDER')

	useEffect(() => {
		// socket.on('user-disconnected', userId => {
		// 	if (peers[userId]) peers[userId].close()
		// })
		
		myPeer.current.on('open', id => {
			socket.emit('join-room', roomId, id)
		})
	})

	useEffect(() => {	
		navigator.mediaDevices.getUserMedia({
			video: true,
			audio: true
		}).then(stream => {
			myVideoStream.current.srcObject = stream;
			// addVideoStream(stream)
			
			myPeer.current.on('call', call => {
				call.answer(stream)
				
				// const video = document.createElement('video')
				
				call.on('stream', userVideoStream => {
					addVideoStream(userVideoStream)
				})
			})
			
			socket.on('user-connected', userId => {
				console.log('user-connected', userId)
				connectToNewUser(userId, stream)
			})
			
		})

	}, [])

	function addVideoStream(stream) {
		// video.srcObject = stream
		// video.addEventListener('loadedmetadata', () => {
		// 	video.play()
		// })
		// videoGrid.append(video)
		setVideos([ ...videos, stream ])
	}

	function connectToNewUser(userId, stream) {
		const call = myPeer.current.call(userId, stream)
		// const video = document.createElement('video')

		call.on('stream', userVideoStream => {
			// addVideoStream(video, userVideoStream)
			addVideoStream(userVideoStream)
		})
		// call.on('close', () => {
		// 	video.remove()
		// })

		// peers[userId] = call
	}


	return (
		<main className="Page Room">
			<div className="container">
				<div className="box">
					<h1 className="title title--big">Название конференции</h1>
				</div>

				<div className="videos">
					<video ref={myVideoStream} muted autoPlay width={300} height={240}></video>

					{ videos && videos.length &&
						videos.map((stream, i) => (
							<VideoCam 
								key={i + Date.now()}
								stream={stream}
							/>
						))
					}
				</div>
			</div>
		</main>
	)
}

export default connect(
	null,
	{
		fetchCurrentRoom: roomsActions.fetchCurrentRoom,
		setCurrentRoomUsers: roomsActions.setCurrentRoomUsers,
		addNewUserToRoom: roomsActions.addNewUserToRoom,
		removeUserFromRoom: roomsActions.removeUserFromRoom,
	}
)(Room)















// import React, { useEffect, useRef, useState } from "react";
// import { useParams } from 'react-router-dom';

// import socket from '../../api/socket';
// import Peer from "simple-peer";


// const Video = ({ peer }) => {
// 	const ref = useRef();

// 	useEffect(() => {
// 		peer.on("stream", stream => {
// 			ref.current.srcObject = stream;
// 			// ref.current.src = window.URL.createObjectURL(stream) // for older browsers

// 			// ref.current.play()
// 		})
// 	}, [peer]);

// 	return (
// 		<video autoPlay ref={ref}></video>
// 	);
// }


// const Room = (props) => {
// 	const [peers, setPeers] = useState([]);
// 	const socketRef = useRef();
// 	const userVideo = useRef();
// 	const peersRef = useRef([]);
// 	const { roomId } = useParams();

// 	useEffect(() => {
// 		// socketRef.current = io.connect("/");
// 		socketRef.current = socket;
// 		// navigator.mediaDevices.getUserMedia({ video: videoConstraints, audio: true }).then(stream => {

// 		navigator.mediaDevices.getUserMedia({
// 			// navigator.getUserMedia({ 
// 			video: { width: 300, height: 240 },
// 			// video: true, 
// 			audio: true
// 		}).then(stream => {
// 			userVideo.current.srcObject = stream;
// 			// userVideo.current.src = window.URL.createObjectURL(stream) // for older browsers

// 			console.log(userVideo)

// 			console.log('userVideo', userVideo)

// 			socketRef.current.emit("join room", roomId);
// 			socketRef.current.on("all users", users => {
// 				const peers = [];
// 				users.forEach(userID => {
// 					const peer = createPeer(userID, socketRef.current.id, stream);
// 					peersRef.current.push({
// 						peerID: userID,
// 						peer,
// 					})
// 					peers.push(peer);
// 				})
// 				// console.log('peers', peers)
// 				setPeers(peers);
// 			})

// 			socketRef.current.on("user joined", payload => {
// 				const peer = addPeer(payload.signal, payload.callerID, stream);
// 				peersRef.current.push({
// 					peerID: payload.callerID,
// 					peer,
// 				})

// 				console.log('peer', peer)
// 				setPeers(users => [...users, peer]);
// 			});

// 			socketRef.current.on("receiving returned signal", payload => {
// 				const item = peersRef.current.find(p => p.peerID === payload.id);
// 				item.peer.signal(payload.signal);
// 			});
// 		})
// 	}, [roomId]);

// 	function createPeer(userToSignal, callerID, stream) {
// 		const peer = new Peer({
// 			initiator: true,
// 			trickle: false,
// 			stream,
// 		});

// 		peer.on("signal", signal => {
// 			socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
// 		})

// 		return peer;
// 	}

// 	function addPeer(incomingSignal, callerID, stream) {
// 		const peer = new Peer({
// 			initiator: false,
// 			trickle: false,
// 			stream,
// 		})

// 		peer.on("signal", signal => {
// 			socketRef.current.emit("returning signal", { signal, callerID })
// 		})

// 		peer.signal(incomingSignal);

// 		return peer;
// 	}

// 	return (
// 		<main>
// 			<video muted ref={userVideo} autoPlay></video>
// 			{/* <StyledVideo muted ref={userVideo} autoPlay playsInline /> */}
// 			{/* <StyledVideo muted ref={userVideo} /> */}
// 			{peers.map((peer, index) => {
// 				console.log('peer', peer)
// 				return (
// 					<Video key={index + Date.now()} peer={peer} />
// 				);
// 			})}
// 		</main>
// 	);
// };

// export default Room;


































// import React, { useEffect, memo, useRef, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import { useSelector, connect } from 'react-redux';
// import Peer from "simple-peer";

// import socket from '../../api/socket';
// import { roomsActions } from '../../store/actions';

// const Video = ({ peer }) => {
// 	const ref = useRef();

// 	console.log(peer)

// 	useEffect(() => {
// 		peer.on("stream", stream => {
// 			ref.current.srcObject = stream;
// 			// ref.current.src = window.URL.createObjectURL(stream) // for older browsers


// 		})
// 	}, [peer]);

// 	return (
// 		<video autoPlay ref={ref} width={300} height={240}></video>
// 	);
// }

// const Room = memo(({ fetchCurrentRoom, setCurrentRoomUsers, addNewUserToRoom, removeUserFromRoom }) => {
// 	const { roomId } = useParams();
// 	const { curUser } = useSelector(state => state.users);
// 	const { currentRoom } = useSelector(state => state.rooms);

// 	const [peers, setPeers] = useState([]);
// 	const curUserVideo = useRef();
// 	let curVideoStream = useRef(null);

// 	console.log('ROOM RENDER')

// 	// useEffect(() => {
// 	// 	!currentRoom && roomId && fetchCurrentRoom(roomId);
// 	// }, [currentRoom, roomId, fetchCurrentRoom])

// 	// function createPeer(userToSignal, callerID, stream) {
// 	function createPeer(stream, initiator) {
// 		const peer = new Peer({
// 			initiator,
// 			trickle: false,
// 			stream,
// 		});

// 		// peer.on("signal", signal => {
// 		// 	socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
// 		// })

// 		return peer;
// 	}


// 	// function addPeer(stream, initiator) {
// 	// 	const peer = new Peer({
// 	// 		initiator,
// 	// 		trickle: false,
// 	// 		stream,
// 	// 	});

// 	// 	// peer.on("signal", signal => {
// 	// 	// 	socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
// 	// 	// })

// 	// 	peer.signal(incomingSignal);

// 	// 	return peer;
// 	// }

// 	useEffect(() => {
// 		// Входим в комнату roomId
// 		if (roomId) {
// 			navigator.mediaDevices.getUserMedia({ 
// 				video: {width: 300, height: 240}, 
// 				audio: true 
// 			}).then(stream => {
// 				curUserVideo.current.srcObject = stream;
// 				curVideoStream = stream;

// 				const peer = createPeer(stream, true);

// 				peer.on("signal", signal => {
// 					// socketRef.current.emit("sending signal", { userToSignal, callerID, signal })
// 					socket.emit("ROOM:JOIN", { roomId: roomId, userId: curUser._id, fullname: curUser.fullname, signal }, (data) => console.log(data))
// 				})
				
// 				setPeers(curPeers => [...curPeers, peer]);
// 			})
// 		}
// 	}, [roomId, curUser])

// 	useEffect(() => {
// 		socket.on('ROOM:USERS_INFO', data => {
// 			console.log('Пользователей в комнате', data)
// 			setCurrentRoomUsers(data.users)
// 		})
// 	}, [setCurrentRoomUsers])

// 	useEffect(() => {
// 		socket.on('ROOM:NEW_USER', (user) => {
// 			console.log('Новый пользователь', user)

// 			// const peer = addPeer(curVideoStream, false);
// 			const peer = createPeer(curVideoStream, false);
// 			setPeers(curPeers => [...curPeers, peer]);

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

// 				<div className="videos">
// 					<video ref={curUserVideo} autoPlay muted width={300} height={240}></video>

// 					{ peers.length && peers.map((p, i) => {
// 						console.log(p)
// 						return (
// 							// <video ref={curUserVideo} autoPlay muted width={300} height={240}></video>
// 							<Video 
// 								key={i}
// 								peer={p}
// 							/>
// 							// <div>d</div>
// 						)
// 					})

// 					}
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
