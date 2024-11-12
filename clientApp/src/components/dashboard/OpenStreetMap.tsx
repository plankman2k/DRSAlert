import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const OpenStreetMap = () => {
    const mapContainerRef = useRef(null);
    const isInitialized = useRef(false);
    // Coordinates for the center of South Africa
    const southAfricaCoordinates = [-30.5595, 22.9375];

    useEffect(() => {
        if (!isInitialized.current) {
            const map = L.map(mapContainerRef.current, {
                center: southAfricaCoordinates,
                zoom: 13,
            });
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; OpenStreetMap contributors',
            }).addTo(map);
            isInitialized.current = true;
        }
    }, []);

    return <div ref={mapContainerRef} style={{ height: '100vh', width: '100%' }} />;
};

export default OpenStreetMap;
