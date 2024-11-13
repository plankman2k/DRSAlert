'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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
    const [disasterData, setDisasterData] = useState<DisasterData[]>([]);
    const southAfricaCoordinates: [number, number] = [-30.5595, 22.9375];

    useEffect(() => {
        // Fix marker icons
        delete (L.Icon.Default.prototype as any)._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });

        const fetchDisasterData = async () => {
            try {
                const token = localStorage.getItem('jwtToken');
                if (!token) {
                    throw new Error('No token found');
                }

                const response = await fetch('https://localhost:7155/disasters', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: DisasterData[] = await response.json();
                setDisasterData(data);
            } catch (error) {
                console.error('Error fetching disaster data:', error);
            }
        };
        fetchDisasterData();
    }, []);

    if (typeof window === 'undefined') return null;

    return (
        <div className="h-[600px] w-full relative">
            <MapContainer
                center={southAfricaCoordinates}
                zoom={6}
                className="h-full w-full absolute"
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                />
                {disasterData.map((disaster) => (
                    <Marker
                        key={disaster.id}
                        position={[disaster.latitude, disaster.longitude]}
                    >
                        <Popup>
                            <div>
                                <h3>{disaster.city}</h3>
                                <p>Type: {disaster.disasterType}</p>
                                <p>Severity: {disaster.disasterValue}</p>
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};

export default OpenStreetMap;