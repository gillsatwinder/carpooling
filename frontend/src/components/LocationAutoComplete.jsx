import { useEffect, useState } from "react";
import axios from "axios";

const API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder,
  name,
}) {
  const [query, setQuery] = useState(value || "");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await axios.get(
          "https://api.geoapify.com/v1/geocode/autocomplete",
          {
            params: {
              text: query,
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

    return () => clearTimeout(timeout);
  }, [query]);

  return (
    <div className="relative">
      <input
        name={name}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
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

      {suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-64 overflow-y-auto">
          {suggestions.map((item) => (
            <button
              type="button"
              key={item.properties.place_id}
              onClick={() => {
                setQuery(item.properties.formatted);

                onChange({
                  target: {
                    name,
                    value: item.properties.formatted,
                  },
                });

                setSuggestions([]);
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