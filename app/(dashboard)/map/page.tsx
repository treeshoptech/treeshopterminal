'use client';

import { useState, useCallback, useRef } from 'react';
import { useQuery, useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Polygon, DrawingManager } from '@react-google-maps/api';
import { MapPin, Layers, Maximize, Edit3, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import type { Id } from '@/convex/_generated/dataModel';
import styles from './page.module.css';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 29.0261,
  lng: -81.0726,
};

const libraries: ('drawing' | 'geometry')[] = ['drawing', 'geometry'];

export default function MapPage() {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [selectedSite, setSelectedSite] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [drawingMode, setDrawingMode] = useState<'polygon' | null>(null);
  const [drawnPolygon, setDrawnPolygon] = useState<google.maps.Polygon | null>(null);
  const [polygonCoords, setPolygonCoords] = useState<{lat: number; lng: number}[]>([]);
  const [polygonArea, setPolygonArea] = useState<number | null>(null);

  const organizationId = 'org_mock123';
  const jobSites = useQuery(api.jobSites.list, { organizationId });
  const customers = useQuery(api.customers.list, { organizationId });
  const updateJobSite = useMutation(api.jobSites.update);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyCUKaBZ4zGS9pMHWgDM0P8PlrwWO4C-fJY',
    libraries,
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

  const handlePolygonComplete = useCallback((polygon: google.maps.Polygon) => {
    setDrawnPolygon(polygon);
    setDrawingMode(null);

    const path = polygon.getPath();
    const coords: {lat: number; lng: number}[] = [];

    for (let i = 0; i < path.getLength(); i++) {
      const point = path.getAt(i);
      coords.push({ lat: point.lat(), lng: point.lng() });
    }

    setPolygonCoords(coords);

    // Calculate area in acres using Google Maps geometry library
    if (window.google?.maps?.geometry) {
      const areaMeters = window.google.maps.geometry.spherical.computeArea(path);
      const acres = areaMeters / 4046.86; // Convert square meters to acres
      setPolygonArea(acres);
    }
  }, []);

  const clearPolygon = () => {
    if (drawnPolygon) {
      drawnPolygon.setMap(null);
      setDrawnPolygon(null);
    }
    setPolygonCoords([]);
    setPolygonArea(null);
  };

  const savePolygonToSite = async () => {
    if (!selectedSite || !polygonCoords.length || !polygonArea) {
      alert('Please select a job site and draw a polygon first');
      return;
    }

    await updateJobSite({
      id: selectedSite as Id<'jobSites'>,
      polygon: polygonCoords,
      polygonArea,
      acreage: polygonArea,
    });

    alert(`Polygon saved! Area: ${polygonArea.toFixed(2)} acres`);
    clearPolygon();
  };

  const selectedSiteData = jobSites?.find((site) => site._id === selectedSite);
  const selectedSiteCustomer = selectedSiteData?.customerId
    ? customers?.find(c => c._id === selectedSiteData.customerId)
    : null;

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
              {drawingMode && (
                <DrawingManager
                  drawingMode={google.maps.drawing.OverlayType.POLYGON}
                  options={{
                    drawingControl: false,
                    polygonOptions: {
                      fillColor: '#3B82F6',
                      fillOpacity: 0.3,
                      strokeColor: '#3B82F6',
                      strokeWeight: 2,
                      editable: true,
                      draggable: true,
                    },
                  }}
                  onPolygonComplete={handlePolygonComplete}
                />
              )}

              {jobSites?.map((site) => (
                <>
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
                  {site.polygon && (
                    <Polygon
                      key={`polygon-${site._id}`}
                      paths={site.polygon}
                      options={{
                        fillColor: selectedSite === site._id ? '#3B82F6' : '#10B981',
                        fillOpacity: 0.2,
                        strokeColor: selectedSite === site._id ? '#3B82F6' : '#10B981',
                        strokeWeight: 2,
                      }}
                    />
                  )}
                </>
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
                    {selectedSiteCustomer && (
                      <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#3B82F6', fontWeight: '500' }}>
                        {selectedSiteCustomer.name}
                      </p>
                    )}
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {selectedSiteData.address}
                    </p>
                    <p style={{ margin: '0 0 4px 0', fontSize: '14px', color: '#666' }}>
                      {selectedSiteData.city}, {selectedSiteData.state} {selectedSiteData.zipCode}
                    </p>
                    {selectedSiteData.acreage && (
                      <p style={{ margin: '8px 0 0 0', fontSize: '14px', fontWeight: '500' }}>
                        {selectedSiteData.acreage.toFixed(2)} acres
                      </p>
                    )}
                    {selectedSiteData.polygon && (
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#10B981' }}>
                        Boundary mapped
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

            {selectedSite && (
              <div className={styles.drawingTools}>
                <div style={{ marginBottom: '12px' }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
                    Measurement Tools
                  </h4>
                  <p style={{ margin: '0', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    Draw property boundaries to calculate acreage
                  </p>
                </div>

                {!drawnPolygon ? (
                  <Button
                    size="sm"
                    onClick={() => setDrawingMode('polygon')}
                    disabled={drawingMode === 'polygon'}
                  >
                    <Edit3 size={16} style={{ marginRight: '8px' }} />
                    {drawingMode ? 'Drawing...' : 'Draw Boundary'}
                  </Button>
                ) : (
                  <div>
                    {polygonArea && (
                      <div style={{
                        padding: '12px',
                        backgroundColor: 'var(--surface)',
                        borderRadius: '8px',
                        marginBottom: '12px',
                        border: '1px solid var(--border)'
                      }}>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                          Measured Area
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: '600', color: 'var(--color-primary)' }}>
                          {polygonArea.toFixed(2)} acres
                        </div>
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Button
                        size="sm"
                        onClick={savePolygonToSite}
                      >
                        <Save size={16} style={{ marginRight: '8px' }} />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={clearPolygon}
                      >
                        <Trash2 size={16} style={{ marginRight: '8px' }} />
                        Clear
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
