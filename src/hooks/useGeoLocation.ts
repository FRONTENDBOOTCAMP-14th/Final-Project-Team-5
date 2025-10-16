import { useEffect, useState } from 'react';

// 현재 위치 가져오기
export default function useGeoLocation() {
  const [lat, setLat] = useState<number | undefined>();
  const [lon, setLon] = useState<number | undefined>();

  useEffect(() => {
    function OnGeoOk(position: GeolocationPosition) {
      setLat(position.coords.latitude);
      setLon(position.coords.longitude);
    }

    function OnGeoError() {
      throw new Error('Can not find you!');
    }

    navigator.geolocation.getCurrentPosition(OnGeoOk, OnGeoError);
  }, []);

  return { lat, lon };
}
