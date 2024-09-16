import { useJsApiLoader } from '@react-google-maps/api';
const key = 'AIzaSyB2hWA2JJpjMSmKWQOVygtFtS_zzOtRKL0';

function LoadMap() {
    useJsApiLoader({
        googleMapsApiKey: key,
        libraries: ['visualization'],
    });
}

export default LoadMap;
