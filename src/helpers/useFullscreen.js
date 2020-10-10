import { useState } from 'react';

const useFullscreen = (ref) => {
	const [isFullscreen, setIsFullscreen] = useState(false);

	const handleFullscreen = () => {
		const elem = ref.current;

		if (!isFullscreen) {
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
		} else {
			document.exitFullscreen();
		}

		setIsFullscreen(!isFullscreen);
	}

	return {
		isFullscreen,
		handleFullscreen
	}
}

export default useFullscreen;