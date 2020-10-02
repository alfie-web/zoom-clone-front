import { useEffect } from 'react';

export default (observableRef, callback, isFetching) => {
	useEffect(() => {
                const options = {
			root: null,
                        rootMargin: "0px",
                        threshold: 1
		};
		
		const observer = new IntersectionObserver((entires) => {
			if (entires[0].intersectionRatio && !isFetching) {
				// fetchUsers({});
				callback()
			}

		}, options)

		observableRef.current && observer.observe(observableRef.current);
		return () => observer.disconnect();
                
        }, [callback, isFetching, observableRef])
}