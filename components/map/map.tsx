import React, { CSSProperties, useState } from "react";
import { GoogleMap, useJsApiLoader } from "@react-google-maps/api";
import { defaultLocation } from "@/config/global";
import useSettingsStore from "@/global-store/settings";
import { IconButton } from "@/components/icon-button";
import NavigationIcon from "@/assets/icons/navigation";
import { LoadingCard } from "@/components/loading";

interface MapProps extends React.PropsWithChildren {
  center?: {
    lat: number;
    lng: number;
  };
  zoom?: number;
  containerStyles: CSSProperties;
  options?: google.maps.MapOptions;
  onClick?: (e: google.maps.MapMouseEvent) => void;
  onLoad?: (map: google.maps.Map) => void;
  findMyLocation?: boolean;
}

const libraries: "places"[] = ["places"];

export const Map: React.FC<MapProps> = ({
  center = defaultLocation,
  containerStyles,
  children,
  zoom = 9,
  options,
  onClick,
  onLoad,
  findMyLocation = true,
}) => {
  const [currentCenter, setCurrentCenter] = useState(center);
  const settings = useSettingsStore((state) => state.settings);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: settings?.google_map_key || process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY,
    libraries,
  });

  const getUserCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setCurrentCenter({ lat: position.coords.latitude, lng: position.coords.longitude });
      });
    }
  };

  const renderMap = () => (
    <GoogleMap
      mapContainerStyle={containerStyles}
      center={currentCenter}
      onLoad={onLoad}
      mapContainerClassName="!font-sans"
      zoom={zoom}
      options={options}
      onClick={onClick}
    >
      {children}
      {findMyLocation && (
        <div className="absolute bottom-6 right-6">
          <IconButton
            type="button"
            onClick={getUserCurrentLocation}
            size="large"
            color="white"
            rounded
          >
            <NavigationIcon />
          </IconButton>
        </div>
      )}
    </GoogleMap>
  );

  return isLoaded ? renderMap() : <LoadingCard />;
};
