

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

// TODO: Посмотреть решение проблемы с шумом тут https://overcoder.net/q/1218879/%D1%88%D1%83%D0%BC-%D1%8D%D1%85%D0%BE-%D0%B2-%D0%B2%D0%B8%D0%B4%D0%B5%D0%BE%D1%87%D0%B0%D1%82%D0%B5-webrtc
// TODO: Как-то  валидировать пользователя, есть ли он в списке приглашенных (как вар в RoomInfo)

const FullscreenModeButton = ({ isFullscreen, handleFullscreen }) => {
	return (
		<Button
			className="Room__video-fullscreen Room__video-btn"
			icon={!isFullscreen
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
		/>
	)
}

const CurrentUserVideo = ({ userVideoRef, peers, curUser }) => {
	const ref = useRef();
	const {isFullscreen, handleFullscreen} = useFullscreen(ref);

	return (
		<div
			ref={ref}
			className={classNames('Room__video Room__video--my', {
				'Room__video--big': peers.length < 3,
				'Room__video--small': peers.length > 6
			})}
		>
			{/* Показываем имя, когда видео скрыто */}
			{/* {userVideoAudio['localUser'].video ? null : (
				<p>{curUser.fullname}</p>
			)} */}

			<p className="Room__video-fullname">{curUser.fullname}</p>

			<div className="Room__video-options">
				<FullscreenModeButton 
					isFullscreen={isFullscreen}
					handleFullscreen={handleFullscreen}
				/>
			</div>

			<video
				ref={userVideoRef}
				muted
				autoPlay
				playsInline={true}
			></video>
		</div>
	)
}

const UserVideo = ({ peers, peer }) => {
	const ref = useRef();
	const {isFullscreen, handleFullscreen} = useFullscreen(ref);

	return (
		<div
			className={classNames('Room__video', {
				'Room__video--big': peers.length < 3,
				'Room__video--small': peers.length > 6
			})}
			ref={ref}
		>
			
			{/* Это если видео скрыто */}
			{/* if (!userVideoAudio[userName].video) && <p className="Room__video-fullname">{peer.userName}</p> */}
			<p className="Room__video-fullname">{peer.userName}</p>

			<div className="Room__video-options">
				<FullscreenModeButton 
					isFullscreen={isFullscreen}
					handleFullscreen={handleFullscreen}
				/>
			</div>


			<VideoCard peer={peer} />
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

	console.log('RENDERS')
	// BackButton
	// const goToBack = React.useCallback((e) => {
	// 	console.log('Выходим назад')
	// 	e && e.preventDefault();
	// 	socket.emit('BE-leave-room', { roomId, leaver: curUser.fullname });
	// 	// sessionStorage.removeItem('user');
	// 	window.location.href = '/';
	// }, [roomId, curUser.fullname]);

	useEffect(() => {
		// Set Back Button Event
		// window.addEventListener('popstate', goToBack);
		

		// Connect Camera & Mic
		navigator.mediaDevices
			.getUserMedia({ video: true, audio: true })
			.then((stream) => {
				console.log('update')
				userVideoRef.current.srcObject = stream;
				userStream.current = stream;

				socket.emit('BE-join-room', { roomId, userName: curUser.fullname, userId: curUser._id });

				socket.on('FE-user-join', (users) => {
					console.log('FE-user-join')
					// all users
					const peers = [];
					users.forEach(({ socketId, info }) => {
						let { userName, video, audio, userId } = info;

						if (userName !== curUser.fullname) {
							const peer = createPeer(socketId, socket.id, stream);

							peer.userName = userName;
							peer.peerID = socketId;
							peer.userId = userId;

							peersRef.current.push({
								peerID: socketId,
								peer,
								userName,
								userId
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
					let { userName, video, audio, userId } = info;
					const peerIdx = findPeer(from);

					if (!peerIdx) {
						const peer = addPeer(signal, from, stream);

						peer.userName = userName;
						peer.userId = userId;

						peersRef.current.push({
							peerID: from,
							peer,
							userName: userName,
							userId
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

				socket.on('FE-user-leave', ({ socketId, userName }) => {
					console.log('FE-user-leave')
					const peerIdx = findPeer(socketId);
					peerIdx.peer.destroy();
					setPeers((users) => {
						users = users.filter((user) => user.peerID !== peerIdx.peer.peerID);
						return [...users];
					});
				});
			});

		socket.on('FE-toggle-camera', ({ socketId, switchTarget }) => {
			const peerIdx = findPeer(socketId);

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
			console.log('unmount')
			// socket.emit('BE-leave-room', { roomId, leaver: curUser.fullname });
			// goToBack()

			socket.emit('BE-leave-room', { roomId, leaver: curUser.fullname });

			socket.disconnect();

			// window.history.back();
			window.location.href = '/';
		};
	}, [roomId, curUser.fullname, curUser._id]);
	// }, [roomId, curUser.fullname, goToBack]);

	// TODO: Сделать addOrCreatePeer
	function createPeer(socketId, caller, stream) {
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream,
		});

		peer.on('signal', (signal) => {
			socket.emit('BE-call-user', {
				userToCall: socketId,
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


	// // Open Chat
	// const clickChat = (e) => {
	// 	e.stopPropagation();
	// 	setDisplayChat(!displayChat);
	// };

	

	const toggleCameraAudio = (switchType) => {
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


	return (
		<main className="Page Room">
			<div className="container">
				<RoomInfo roomId={roomId} />

				<div className="Room__videocams">
					{/* Current User Video */}
					<CurrentUserVideo 
						userVideoRef={userVideoRef}
						peers={peers}
						curUser={curUser}
					/>

					{/* Joined Users Video */}
					{peers &&
						peers.map((peer, index) => (
							<UserVideo 
								key={index}
								peer={peer}
								peers={peers}
							/>
						))}
				</div>
		
		
			</div>

			<BottomBar
				clickScreenSharing={clickScreenSharing}
				// clickChat={clickChat}
				// goToBack={goToBack}
				toggleCameraAudio={toggleCameraAudio}
				userVideoAudio={userVideoAudio['localUser']}
				screenShare={screenShare}
			/>

		</main>
	);
};

export default Room;





































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
