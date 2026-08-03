import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  onSelect,
  name,
}) {

  const [suggestions, setSuggestions] = useState([]);
  const [selectedValue, setSelectedValue] = useState("");


  useEffect(() => {


    if (!value || value.length < 3) {
      return;
    }
    // Don't search if the user just selected this value
    if (value === selectedValue) {
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/autocomplete",
          {
            params: {
              text: value,
              apiKey: API_KEY,
              limit: 5,
            },
          }
        );

        setSuggestions(res.data.features);
      } catch (err) {
        console.error(err);
      }
    }, 300);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [value, selectedValue]);

  const visibleSuggestions =
    value && value.length >= 3 ? suggestions : [];

  return (
    <div className="relative">
      <input
        name={name}
        value={value ?? ""}
        onChange={(e) => {
          onChange({
            target: {
              name,
              value: e.target.value,
            },
          });
        }}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-200 px-3 py-2.5"
      />

      {visibleSuggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {visibleSuggestions.map((item) => (
            <button
              type="button"
              key={item.properties.place_id}
              onMouseDown={(e) => {
                e.preventDefault();
                const location = {
                  formatted: item.properties.formatted,
                  lat: item.properties.lat,
                  lon: item.properties.lon,
                };


                setSelectedValue(location.formatted);
                setSuggestions([]);

                onSelect?.(location);
              }}
              className="w-full text-left px-4 py-3 hover:bg-slate-100"
            >
              {item.properties.formatted}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}