'use client';

import { useState, useCallback } from 'react';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Layers, Maximize } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 29.0261,
  lng: -81.0726,
};

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');

  const organizationId = 'org_mock123';
  const jobSites = useQuery(api.jobSites.list, { organizationId });

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCUKaBZ4zGS9pMHWgDM0P8PlrwWO4C-fJY',
  });

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleSiteClick = (siteId: string, coordinates: { lat: number; lng: number }) => {
    setSelectedSite(siteId);
    if (map) {
      map.panTo(coordinates);
      map.setZoom(15);
    }
  };

  const toggleMapType = () => {
    setMapType((prev) => (prev === 'roadmap' ? 'satellite' : 'roadmap'));
  };

  const fitAllMarkers = () => {
    if (!map || !jobSites || jobSites.length === 0) return;

    const bounds = new google.maps.LatLngBounds();
    jobSites.forEach((site) => {
      bounds.extend(new google.maps.LatLng(site.coordinates.lat, site.coordinates.lng));
    });
    map.fitBounds(bounds);
  };

  const selectedSiteData = jobSites?.find((site) => site._id === selectedSite);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Job Sites Map</h1>
          <p className={styles.subtitle}>
            {jobSites?.length || 0} active job sites
          </p>
        </div>
        <Button onClick={() => window.location.href = '/map/create-site'}>
          <MapPin className="w-4 h-4" style={{ marginRight: '8px' }} />
          Add Job Site
        </Button>
      </div>

      <div className={styles.mapContainer}>
        {!isLoaded ? (
          <div className={styles.loading}>Loading map...</div>
        ) : (
          <>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={defaultCenter}
              zoom={10}
              onLoad={onLoad}
              onUnmount={onUnmount}
              mapTypeId={mapType}
              options={{
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false,
              }}
            >
              {jobSites?.map((site) => (
                <Marker
                  key={site._id}
                  position={{
                    lat: site.coordinates.lat,
                    lng: site.coordinates.lng,
                  }}
                  onClick={() => setSelectedSite(site._id)}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: selectedSite === site._id ? '#3B82F6' : '#10B981',
                    fillOpacity: 1,
                    strokeColor: '#FFFFFF',
                    strokeWeight: 2,
                  }}
                />
              ))}

              {selectedSiteData && (
                <InfoWindow
                  position={{
                    lat: selectedSiteData.coordinates.lat,
                    lng: selectedSiteData.coordinates.lng,
                  }}
                  onCloseClick={() => setSelectedSite(null)}
                >
                  <div style={{ padding: '8px', minWidth: '200px' }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
                      {selectedSiteData.siteName}
                    </h3>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {selectedSiteData.address}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {selectedSiteData.city}, {selectedSiteData.state} {selectedSiteData.zipCode}
                    </p>
                    {selectedSiteData.acreage && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                        {selectedSiteData.acreage} acres
                      </p>
                    )}
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>

            {jobSites && jobSites.length > 0 && (
              <div className={styles.sidebar}>
                <div className={styles.sidebarHeader}>
                  <h3 className={styles.sidebarTitle}>Job Sites</h3>
                  <p style={{ margin: 0, fontSize: '14px', color: 'var(--text-secondary)' }}>
                    Click to view on map
                  </p>
                </div>
                <div className={styles.sidebarList}>
                  {jobSites.map((site) => (
                    <div
                      key={site._id}
                      className={`${styles.siteItem} ${selectedSite === site._id ? styles.active : ''}`}
                      onClick={() => handleSiteClick(site._id, site.coordinates)}
                    >
                      <h4 className={styles.siteName}>{site.siteName}</h4>
                      <p className={styles.siteAddress}>
                        {site.address}, {site.city}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className={styles.controls}>
              <button
                className={styles.controlButton}
                onClick={toggleMapType}
                title="Toggle map type"
              >
                <Layers size={20} />
              </button>
              {jobSites && jobSites.length > 0 && (
                <button
                  className={styles.controlButton}
                  onClick={fitAllMarkers}
                  title="Fit all markers"
                >
                  <Maximize size={20} />
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
