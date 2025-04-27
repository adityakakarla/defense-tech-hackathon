'use client';
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

interface MarkerData {
  id?: string;
  latitude: number;
  longitude: number;
  name: string;
  type: string;
  data: any;
  color?: string;
}

interface MapClickEvent {
  lngLat: [number, number];
  point: [number, number];
}

const MapboxMap = ({
  initialCenter = [-122.4, 37.8],
  initialZoom = 12,
  markerData = [] as MarkerData[],
  onMapClick = (event: MapClickEvent) => {},
  mapStyle = 'mapbox://styles/mapbox/satellite-v9',
  onViewData = (markerData: MarkerData) => {},
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

  // Function to add markers to the map
  const addMarkersToMap = () => {
    if (!map.current || !mapLoaded) return;
    
    // Clear existing markers
    Object.values(markerRefs.current).forEach(marker => marker.remove());
    markerRefs.current = {};
    
    // Add new markers
    markerData.forEach((marker, index) => {
      const id = marker.id || `marker-${index}`;
      
      // Create a custom element for the chevron marker
      const el = document.createElement('div');
      el.className = 'custom-marker chevron-down';
      el.innerHTML = `<svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 9L12 15L18 9" stroke="#FFFFFF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0 0 4px #000000) drop-shadow(0 0 2px #000000)"/>
      </svg>`;
      
      // Create popup content with marker info and directly display the data
      const popupContent = `
        <div class="marker-popup">
          <h3 class="text-xl font-bold mb-2">${marker.name}</h3>
          <p class="text-base text-gray-600 mb-3">${marker.type}</p>
          <div class="marker-data mt-4 p-3 bg-gray-100 rounded overflow-auto max-h-96">
            <pre>${JSON.stringify(marker.data, null, 2)}</pre>
          </div>
        </div>
      `;
      
      // Create and add the marker to the map
      const mapMarker = new mapboxgl.Marker(el)
        .setLngLat([marker.longitude, marker.latitude])
        .addTo(map.current!);
      
      // Create and set popup
      const popup = new mapboxgl.Popup({ 
        offset: 35, 
        closeButton: true,
        className: 'black-white-popup'
      })
        .setHTML(popupContent);
      
      mapMarker.setPopup(popup);
      
      // Store reference to the marker
      markerRefs.current[id] = mapMarker;
    });
  };

  // Call addMarkersToMap when map is loaded or markerData changes
  useEffect(() => {
    addMarkersToMap();
  }, [mapLoaded, markerData]);

  return (
    <div className="relative h-full w-full">
      <div className="absolute top-2 left-2 bg-white text-black bg-opacity-75 p-2 rounded z-10 text-sm">
        Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
      </div>
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
        
        .marker-popup {
          padding: 20px;
          color: #000;
          width: 100%;
        }
        
        .marker-data {
          max-height: 500px;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-word;
          font-family: monospace;
          font-size: 14px;
        }
        
        .black-white-popup .mapboxgl-popup-content {
          background-color: white;
          color: black;
          border: 2px solid black;
          border-radius: 8px;
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
          width: 700px;
          max-width: 90vw;
          padding: 5px;
        }
        
        .black-white-popup .mapboxgl-popup {
          max-width: 90vw !important;
          width: auto !important;
        }
        
        .black-white-popup .mapboxgl-popup-close-button {
          color: black;
          font-size: 24px;
          padding: 8px 12px;
          right: 5px;
          top: 5px;
        }
        
        .black-white-popup .mapboxgl-popup-tip {
          border-top-color: white !important;
        }
      `}</style>
    </div>
  );
};

export default MapboxMap;