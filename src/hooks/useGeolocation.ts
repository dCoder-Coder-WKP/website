'use client';

import { useState, useCallback } from 'react';

export type GeolocationState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; lat: number; lon: number; address: string; mapsLink: string }
  | { status: 'error'; message: string };

export function useGeolocation(): [GeolocationState, () => void] {
  const [state, setState] = useState<GeolocationState>({ status: 'idle' });

  const trigger = useCallback(() => {
    // Guard: SSR or unsupported browser
    if (typeof navigator === 'undefined' || !navigator.geolocation) {
      setState({ status: 'error', message: 'Location unavailable' });
      return;
    }

    setState({ status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      // onSuccess
      (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const mapsLink = `https://www.google.com/maps?q=${lat},${lon}`;

        const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;

        fetch(url, {
          headers: { 'User-Agent': 'WKP-Website/1.0' },
        })
          .then((r) => {
            if (!r.ok) throw new Error(`Nominatim ${r.status}`);
            return r.json();
          })
          .then((data) => {
            setState({
              status: 'success',
              lat,
              lon,
              address: data.display_name || `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
              mapsLink,
            });
          })
          .catch(() => {
            // Nominatim failure (429, network, etc.): use raw coords
            setState({
              status: 'success',
              lat,
              lon,
              address: `${lat.toFixed(4)}, ${lon.toFixed(4)}`,
              mapsLink,
            });
          });
      },
      // onError (code 1 = PERMISSION_DENIED, 2 = POSITION_UNAVAILABLE, 3 = TIMEOUT)
      () => {
        setState({ status: 'error', message: 'Location unavailable' });
      },
      { timeout: 10000, maximumAge: 60000 }
    );
  }, []);

  return [state, trigger];
}
