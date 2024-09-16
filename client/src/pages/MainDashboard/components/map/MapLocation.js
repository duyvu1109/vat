import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
const containerStyle = {
    width: '100%',
    height: '100%',
};
const key = 'AIzaSyB2hWA2JJpjMSmKWQOVygtFtS_zzOtRKL0';
function MapLocation(props) {
    const [infoWindowData, setInfoWindowData] = useState(false);
    const onMarkerClick = (props, marker, e) => {
        setInfoWindowData(true);
    };

    const onInfoWindowClose = () => {
        setInfoWindowData(false);
    };
    const [attribute, setAttribute] = useState(props.attribute);

    useEffect(() => {
        if (props.attribute) {
            if (attribute.latitude && attribute.longitude) {
                let newPosition = {
                    lat: attribute.latitude ? Number(attribute.latitude) : 10,
                    lng: attribute.longitude ? Number(attribute.longitude) : 106,
                };
            }
            setAttribute(props.attribute);
        }
    }, [props.attribute]);

    return (
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
                </>
            }
            mapContainerStyle={containerStyle}
            center={{
                lat: attribute ? Number(attribute.latitude) : 10,
                lng: attribute ? Number(attribute.longitude) : 106,
            }}
            zoom={8}
        ></GoogleMap>
    );
}
export default MapLocation;
