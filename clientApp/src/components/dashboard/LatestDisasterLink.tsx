import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '../../context/AuthContext';
import { AlertTriangle } from 'lucide-react';

interface Disaster {
  type: string;
  location: string;
  severity: number;
  time: string;
}

const LatestDisasterLink: React.FC = () => {
  const [latestDisaster, setLatestDisaster] = useState<Disaster | null>(null);

  const disasterMapping: { [key: string]: string } = {
    temp: 'Drought',
    wind_speed: 'Wildfire',
    rainfall: 'Storm'
  };

  const mapDisasterType = (type: string): string => {
    return disasterMapping[type] || type;
  };

  const generateRandomSeverity = (): number => {
    return Math.floor(Math.random() * 5) + 1;
  };

  const generateTimestamp = (): string => {
    return new Date().toLocaleTimeString();
  };

  useEffect(() => {
    const fetchLatestDisaster = async () => {
      try {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch('https://localhost:7155/topdisasters', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();
        const mappedDisaster = {
          ...data,
          type: mapDisasterType(data.type),
          severity: generateRandomSeverity(),
          time: generateTimestamp()
        };
        setLatestDisaster(mappedDisaster);
      } catch (error) {
        console.error('Error fetching latest disaster:', error);
      }
    };

    fetchLatestDisaster();
  }, []);

  if (!latestDisaster) {
    return <p>Loading latest disaster information...</p>;
  }

  return (
    <Link href="#alerts">
      <a className="flex items-center text-yellow-300 hover:text-yellow-100">
        <AlertTriangle className="h-4 w-4 mr-2" />
        {latestDisaster.type} in {latestDisaster.location} - Severity: {latestDisaster.severity}/5
      </a>
    </Link>
  );
};

export default LatestDisasterLink;