"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  address: {
    postcode?: string;
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function LocationAutocomplete({
  value,
  onChange,
  placeholder = "Start typing a city or zip code...",
  className = "",
}: Props) {
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=5&q=${encodeURIComponent(q)}`,
        { headers: { "Accept-Language": "en" } }
      );
      const data: NominatimResult[] = await res.json();
      setResults(data);
      setIsOpen(data.length > 0);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    onChange(val);

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(val), 300);
  };

  const handleSelect = (result: NominatimResult) => {
    const parts: string[] = [];
    const addr = result.address;
    const city = addr.city || addr.town || addr.village;
    if (city) parts.push(city);
    if (addr.state) parts.push(addr.state);
    if (addr.postcode) parts.push(addr.postcode);
    if (addr.country) parts.push(addr.country);

    const formatted = parts.length > 0 ? parts.join(", ") : result.display_name;
    onChange(formatted);
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder={placeholder}
          className={className}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-4 h-4 border-2 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-1 rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
          {results.map((result) => {
            const addr = result.address;
            const city = addr.city || addr.town || addr.village || "";
            const secondary = [addr.state, addr.postcode, addr.country]
              .filter(Boolean)
              .join(", ");

            return (
              <button
                key={result.place_id}
                onClick={() => handleSelect(result)}
                className="w-full text-left px-4 py-3 hover:bg-indigo-50 transition-colors cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="text-sm text-gray-800 font-medium">
                  {city || result.display_name.split(",")[0]}
                </div>
                {secondary && (
                  <div className="text-xs text-gray-400 mt-0.5">
                    {secondary}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
