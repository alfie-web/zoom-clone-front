import qs from 'query-string';

const getQueryParams = () => {
	return qs.parse(window.location.search);
}

export default getQueryParams;