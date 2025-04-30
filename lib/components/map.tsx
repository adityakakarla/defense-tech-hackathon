'use client';
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MarkerInfo {
  id?: string;
  latitude: number;
  longitude: number;
  type: string;
}

interface MapClickEvent {
  lngLat: [number, number];
  point: [number, number];
}

const MapboxMap = ({
  initialCenter = [-122.4, 37.797],
  initialZoom = 13,
  markerInfo = [] as MarkerInfo[],
  onMapClick = (event: MapClickEvent) => {},
  mapStyle = 'mapbox://styles/mapbox/satellite-v9',
  setSensorBeingViewed = (sensorBeingViewed: number) => {}
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [lng, setLng] = useState(initialCenter[0]);
  const [lat, setLat] = useState(initialCenter[1]);
  const [zoom, setZoom] = useState(initialZoom);
  const markerRefs = useRef<Record<string, mapboxgl.Marker>>({});
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (map.current || !mapContainer.current) return;
    mapboxgl.accessToken = MAPBOX_ACCESS_TOKEN || '';
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: mapStyle,
      center: [lng, lat],
      zoom: zoom,
      attributionControl: false
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    map.current.addControl(new mapboxgl.AttributionControl({ compact: true }), 'bottom-right');

    map.current.on('move', () => {
      if (!map.current) return;
      const latitude = parseFloat(map.current.getCenter().lat.toFixed(4));
      const longitude = parseFloat(map.current.getCenter().lng.toFixed(4));
      const zoom = parseFloat(map.current.getZoom().toFixed(2));
      setLng(longitude);
      setLat(latitude);
      setZoom(zoom);
    });

    map.current.on('click', (e: mapboxgl.MapMouseEvent) => {
      onMapClick({
        lngLat: [e.lngLat.lng, e.lngLat.lat],
        point: [e.point.x, e.point.y]
      });
    });

    map.current.on('load', () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, []);

  const addMarkersToMap = () => {
    if (!map.current || !mapLoaded) return;
    
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    markerInfo.forEach((marker, index) => {
      const id = marker.id || `marker-${index}`;
      
      const el = document.createElement('div');
      el.className = 'custom-marker chevron-down';
        
      if (marker.type === "Phone Call" || marker.type === "Police Call") {
      el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FF0000"/>
        <path d="M6 9L12 15L18 9" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #000000) drop-shadow(0 0 2px #000000)"/>
      </svg>`}
      else if (marker.type === "SDR Sensor" || marker.type === "Sensor") {
        el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#800080"/>
        <path d="M6 9L12 15L18 9" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #000000) drop-shadow(0 0 2px #000000)"/>
      </svg>`}
      else if (marker.type === "Ultrasonic Wind Sensor" || marker.type === 'Atmospheric Sensor') {
        el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#40E0D0"/>
        <path d="M6 9L12 15L18 9" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #000000) drop-shadow(0 0 2px #000000)"/>
      </svg>`}
      else if (marker.type === "Earthquake") {
        el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#FFD700"/>
        <path d="M6 9L12 15L18 9" stroke="#000000" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #FFFFFF) drop-shadow(0 0 2px #FFFFFF)"/>
      </svg>`}
      
      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map.current!);
      
      el.addEventListener('click', () => {
        setSensorBeingViewed(index);
      });
      
      markerRefs.current[id] = mapMarker;
    });
  };

  useEffect(() => {
    addMarkersToMap();
  }, [mapLoaded, markerInfo]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapContainer} className="w-full h-full" style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} />
      <style jsx global>{`
        .mapboxgl-ctrl-bottom-right, .mapboxgl-ctrl-bottom-left {
          position: absolute !important;
          bottom: 0 !important;
          z-index: 10 !important;
        }
        
        .custom-marker {
          cursor: pointer;
          width: 36px;
          height: 36px;
          filter: drop-shadow(0px 0px 5px #000000) drop-shadow(0px 0px 5px #000000);
          background-color: rgba(0, 0, 0, 0.6);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;