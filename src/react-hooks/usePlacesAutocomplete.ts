import { RefObject, useEffect, useRef, useState } from "react";

const usePlacesAutocomplete = (
  inputRef: RefObject<HTMLInputElement>,
  opts: google.maps.places.AutocompleteOptions,
  onChange: (place: google.maps.places.PlaceResult) => void
) => {
  const listenerRef = useRef<google.maps.MapsEventListener>();

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  useEffect(() => {
    if (inputRef.current && !autocomplete) {
      const googleMapsAutocomplete = new window.google.maps.places.Autocomplete(
        inputRef.current
      );

      setAutocomplete(googleMapsAutocomplete);
    }
  }, [autocomplete, inputRef, opts]);

  useEffect(() => {
    autocomplete?.setOptions(opts);
  }, [autocomplete, opts]);

  useEffect(() => {
    if (autocomplete) {
      listenerRef.current = autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        onChange(place);
      });
    }

    return () => {
      if (listenerRef.current) {
        listenerRef.current.remove();
      }
    };
  }, [autocomplete, onChange]);
};

export default usePlacesAutocomplete;
