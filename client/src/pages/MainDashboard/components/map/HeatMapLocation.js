import React, { useEffect, useState } from 'react';
import { GoogleMap, HeatmapLayerF, Marker, InfoWindow } from '@react-google-maps/api';
import axios from 'axios';
const containerStyle = {
    width: '100%',
    height: '100%',
};
const key = 'AIzaSyB2hWA2JJpjMSmKWQOVygtFtS_zzOtRKL0';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const API_KEY = 'ca1a0b0b470c76923129d8dacf9177d6';
function HeatMapLocation(props) {
    const getHotPlaces = async (lat, lon, temp) => {
        const response = await axios.get(`${BASE_URL}/find`, {
            params: {
                lat,
                lon,
                cnt: 50, // số lượng kết quả trả về
                appid: API_KEY,
                units: 'metric', // đơn vị nhiệt độ là độ C
            },
        });

        return response.data.list.filter((place) => place.main.temp > temp);
    };
    const [infoWindowData, setInfoWindowData] = useState(false);
    const onMarkerClick = (props, marker, e) => {
        setInfoWindowData(true);
    };

    const onInfoWindowClose = () => {
        setInfoWindowData(false);
    };
    const [loadApi, setLoadApi] = useState(false);
    const [attribute, setAttribute] = useState(props.attribute);
    const [center, setCenter] = useState({
        lat: attribute.latitude ? Number(attribute.latitude) : 10,
        lng: attribute.longitude ? Number(attribute.longitude) : 106,
    });
    const [heatmapData, setHeatmapData] = useState([]);
    useEffect(() => {
        getHotPlaces(
            attribute.latitude ? Number(attribute.latitude) : 10,
            attribute.longitude ? Number(attribute.longitude) : 106,
            30,
        ).then((response) => {
            let newArrayPoint = [];
            response.forEach((element) => {
                let a = 2;
                for (let i = 0; i < 400; i++) {
                    if (i % 20 == 0) {
                        a -= 0.2;
                    }
                    let angle = Math.random() * Math.PI * 2;
                    let x = (Math.cos(angle) * a) / 10;
                    let y = (Math.sin(angle) * a) / 10;
                    newArrayPoint.push(new window.google.maps.LatLng(element.coord.lat + x, element.coord.lon + y));
                }
            });
            setLoadApi(true);
            setHeatmapData(newArrayPoint);
        });
        if (props.attribute) {
            if (attribute.latitude && attribute.longitude) {
                let newPosition = {
                    lat: attribute.latitude ? Number(attribute.latitude) : 10,
                    lng: attribute.longitude ? Number(attribute.longitude) : 106,
                };
                setCenter(newPosition);
            }
            setAttribute(props.attribute);
        }
    }, [props.attribute]);

    if (!loadApi) {
        return <div>Loading</div>;
    }
    return loadApi ? (
        <GoogleMap
            googleMapsApiKey={key}
            children={
                <>
                    <Marker
                        position={{
                            lat: attribute ? Number(attribute.latitude) : 10,
                            lng: attribute ? Number(attribute.longitude) : 106,
                        }}
                        onClick={onMarkerClick}
                    >
                        {infoWindowData && (
                            <InfoWindow
                                onCloseClick={onInfoWindowClose}
                                position={{
                                    lat: attribute ? Number(attribute.latitude) : 10,
                                    lng: attribute ? Number(attribute.longitude) : 106,
                                }}
                            >
                                <div>
                                    <h4>Your location</h4>
                                    <h4>
                                        {'Lat: ' +
                                            (attribute ? attribute.latitude : 10) +
                                            ' Long: ' +
                                            (attribute ? attribute.longitude : 106)}
                                    </h4>
                                </div>
                            </InfoWindow>
                        )}
                    </Marker>
                    <HeatmapLayerF data={heatmapData} />
                </>
            }
            mapContainerStyle={containerStyle}
            center={{
                lat: attribute ? Number(attribute.latitude) : 10,
                lng: attribute ? Number(attribute.longitude) : 106,
            }}
            zoom={8}
        ></GoogleMap>
    ) : (
        <div> Loading...</div>
    );
}

export default HeatMapLocation;
