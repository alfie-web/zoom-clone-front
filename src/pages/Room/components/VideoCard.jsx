import React, { useRef, useEffect } from 'react';

const VideoCard = (props) => {
	const ref = useRef();
	const peer = props.peer;

	useEffect(() => {
		peer.on('stream', (stream) => {
			ref.current.srcObject = stream;
		});
		peer.on('track', (track, stream) => {
		});
	}, [peer]);

	return (
		<video
			playsInline={true}
			autoPlay
			ref={ref}
		></video>
	);
};

export default VideoCard;