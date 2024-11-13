import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
    const [disasterData, setDisasterData] = useState<DisasterData[]>([]);
    const [mapInitialized, setMapInitialized] = useState(false);
    const southAfricaCoordinates: [number, number] = [-30.5595, 22.9375];

    useEffect(() => {
        const fetchDisasterData = async () => {
            try {
                const response = await fetch('https://localhost:7155/disasters');
                const data: DisasterData[] = await response.json();
                setDisasterData(data);
                setMapInitialized(true);
            } catch (error) {
                console.error('Error fetching disaster data:', error);
            }
        };
        fetchDisasterData();
    }, []);

    if (!mapInitialized) {
        return null;
    }

    return (
        <MapContainer center={southAfricaCoordinates} zoom={9} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
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
    );
};

export default OpenStreetMap;