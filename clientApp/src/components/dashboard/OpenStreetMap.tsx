import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface DisasterData {
    id: number;
    city: string;
    latitude: number;
    longitude: number;
    disasterType: string;
    disasterValue: number;
}

const OpenStreetMap = () => {
    const mapContainerRef = useRef(null);
    const isInitialized = useRef(false);
    const [disasterData, setDisasterData] = useState<DisasterData[]>([]);
    // Coordinates for the center of South Africa
    const southAfricaCoordinates = [-30.5595, 22.9375];

    useEffect(() => {
        let map: L.Map;
        if (mapContainerRef.current && !isInitialized.current) {
            map = L.map(mapContainerRef.current as unknown as HTMLElement, {
                center: southAfricaCoordinates as L.LatLngTuple,
                zoom: 9,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
            isInitialized.current = true;
        }
        return () => {
            if (map) {
                map.remove();
            }
        };
    }, [mapContainerRef.current]);

    useEffect(() => {
        // Fetch disaster data from the API
        const fetchDisasterData = async () => {
            try {
                const response = await fetch('https://localhost:7155/disasters');
                const data: DisasterData[] = await response.json();
                setDisasterData(data);
            } catch (error) {
                console.error('Error fetching disaster data:', error);
            }
        };
        fetchDisasterData();
    }, []);

    return (
        // <div ref={mapContainerRef} style={{height: '100vh', width: '100%'}}>
            <MapContainer center={southAfricaCoordinates} zoom={9} style={{height: '100%', width: '100%'}}>
                {disasterData.map((disaster) => (
                    <Marker key={disaster.id} position={[disaster.latitude, disaster.longitude]}>
                        <Popup>
                            <div>
                                <h3>{disaster.city}</h3>
                                <p>Type: {disaster.disasterType}</p>
                                <p>Value: {disaster.disasterValue}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        // </div>

        // <MapContainer center={southAfricaCoordinates} zoom={9} style={{ height: '100%', width: '100%' }}>
        //     {disasterData.map((disaster) => (
        //         <Marker key={disaster.id} position={[disaster.latitude, disaster.longitude]}>
        //             <Popup>
        //                 <div>
        //                     <h3>{disaster.city}</h3>
        //                     <p>Type: {disaster.disasterType}</p>
        //                     <p>Value: {disaster.disasterValue}</p>
        //                 </div>
        //             </Popup>
        //         </Marker>
        //     ))}
        // </MapContainer>
    );
};

export default OpenStreetMap;
