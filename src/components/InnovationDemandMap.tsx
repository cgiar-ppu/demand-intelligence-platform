import { useState, useMemo } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  ZoomableGroup,
} from "react-simple-maps";
import { motion, AnimatePresence } from "framer-motion";
import {
  COUNTRY_GEO,
  getSignalLevel,
  getSignalColor,
  getSignalLabel,
  type Innovation,
  type CountryName,
} from "@/lib/data";

const GEO_URL = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface Props {
  filteredData: Innovation[];
  selectedCountry: string | null;
  onCountryClick: (country: CountryName) => void;
  onInnovationClick: (item: Innovation) => void;
}

export function InnovationDemandMap({
  filteredData,
  selectedCountry,
  onCountryClick,
  onInnovationClick,
}: Props) {
  const [tooltip, setTooltip] = useState<{
    x: number;
    y: number;
    innovation: Innovation;
  } | null>(null);
  const [zoom, setZoom] = useState(1);

  const markers = useMemo(() => {
    const grouped: Record<string, Innovation[]> = {};
    filteredData.forEach((d) => {
      if (!grouped[d.country]) grouped[d.country] = [];
      grouped[d.country].push(d);
    });

    const result: Array<{
      innovation: Innovation;
      lat: number;
      lng: number;
      signal: ReturnType<typeof getSignalLevel>;
    }> = [];

    Object.entries(grouped).forEach(([country, innovations]) => {
      const geo = COUNTRY_GEO.find((g) => g.name === country);
      if (!geo) return;
      innovations.forEach((inn, i) => {
        const angle = (i / innovations.length) * Math.PI * 2;
        const spread = innovations.length > 1 ? 2.5 : 0;
        result.push({
          innovation: inn,
          lat: geo.lat + Math.sin(angle) * spread,
          lng: geo.lng + Math.cos(angle) * spread,
          signal: getSignalLevel(inn),
        });
      });
    });

    return result;
  }, [filteredData]);

  const focusCountries = COUNTRY_GEO.map((g) => g.code);

  // Scale marker radius inversely with zoom so they stay a constant screen size
  const markerRadius = Math.max(2, 5 / zoom);
  const strokeW = Math.max(0.5, 1.5 / zoom);

  return (
    <div className="relative w-full" style={{ aspectRatio: "21/9" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{ scale: 160, center: [25, 5] }}
        style={{ width: "100%", height: "100%" }}
      >
        {/* SVG glow filters */}
        <defs>
          <filter id="glow-high" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feFlood floodColor="hsl(0, 85%, 55%)" floodOpacity="0.6" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-medium" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feFlood floodColor="hsl(45, 95%, 55%)" floodOpacity="0.5" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="glow-low" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feFlood floodColor="hsl(145, 65%, 45%)" floodOpacity="0.4" result="color" />
            <feComposite in="color" in2="blur" operator="in" result="shadow" />
            <feMerge>
              <feMergeNode in="shadow" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <ZoomableGroup
          onMoveEnd={({ zoom: z }) => setZoom(z)}
        >
          <Geographies geography={GEO_URL}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const isFocus = focusCountries.includes(
                  geo.properties?.ISO_A3 || geo.id
                );
                const countryGeo = COUNTRY_GEO.find(
                  (g) => g.code === (geo.properties?.ISO_A3 || geo.id)
                );
                const isSelected =
                  countryGeo && countryGeo.name === selectedCountry;

                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onClick={() => {
                      if (countryGeo) onCountryClick(countryGeo.name);
                    }}
                    style={{
                      default: {
                        fill: isSelected
                          ? "hsl(160, 50%, 42%)"
                          : isFocus
                          ? "hsl(250, 15%, 82%)"
                          : "hsl(250, 10%, 92%)",
                        stroke: "hsl(250, 15%, 75%)",
                        strokeWidth: isFocus ? 0.8 : 0.3,
                        cursor: isFocus ? "pointer" : "default",
                        transition: "fill 0.3s",
                      },
                      hover: {
                        fill: isFocus
                          ? "hsl(160, 50%, 60%)"
                          : "hsl(250, 10%, 92%)",
                        stroke: "hsl(250, 15%, 65%)",
                        strokeWidth: isFocus ? 1.2 : 0.3,
                      },
                      pressed: {
                        fill: "hsl(160, 50%, 35%)",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>

          {markers.map((m, i) => {
            const glowFilter =
              m.signal === "high"
                ? "url(#glow-high)"
                : m.signal === "medium"
                ? "url(#glow-medium)"
                : "url(#glow-low)";

            return (
              <Marker
                key={`${m.innovation.innovation_name}-${m.innovation.country}-${i}`}
                coordinates={[m.lng, m.lat]}
                onMouseEnter={(e) => {
                  const rect = (
                    e.target as SVGElement
                  ).closest("svg")?.getBoundingClientRect();
                  if (rect) {
                    setTooltip({
                      x: e.clientX - rect.left,
                      y: e.clientY - rect.top,
                      innovation: m.innovation,
                    });
                  }
                }}
                onMouseLeave={() => setTooltip(null)}
                onClick={() => onInnovationClick(m.innovation)}
              >
                <circle
                  r={markerRadius}
                  fill={getSignalColor(m.signal)}
                  fillOpacity={0.85}
                  stroke={getSignalColor(m.signal)}
                  strokeWidth={strokeW}
                  strokeOpacity={0.4}
                  filter={glowFilter}
                  style={{ cursor: "pointer" }}
                  className={
                    m.signal === "high"
                      ? "map-pulse-high"
                      : m.signal === "medium"
                      ? "map-pulse-medium"
                      : "map-pulse-low"
                  }
                />
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-3 bg-background/80 backdrop-blur-sm rounded-lg px-3 py-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full signal-high" />
          <span className="text-muted-foreground">High Gap</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full signal-medium" />
          <span className="text-muted-foreground">Moderate</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full signal-low" />
          <span className="text-muted-foreground">Low Gap</span>
        </div>
      </div>

      {/* Tooltip */}
      <AnimatePresence>
        {tooltip && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="absolute z-20 pointer-events-none bg-card border rounded-xl shadow-lg px-4 py-3 max-w-[220px]"
            style={{ left: tooltip.x + 12, top: tooltip.y - 10, borderColor: "hsl(var(--glass-border) / 0.1)" }}
          >
            <p className="font-semibold text-sm">{tooltip.innovation.innovation_name}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{tooltip.innovation.country}</p>
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`inline-block h-2 w-2 rounded-full ${
                  getSignalLevel(tooltip.innovation) === "high"
                    ? "signal-high"
                    : getSignalLevel(tooltip.innovation) === "medium"
                    ? "signal-medium"
                    : "signal-low"
                }`}
              />
              <span className="text-xs font-bold" style={{ color: getSignalColor(getSignalLevel(tooltip.innovation)) }}>
                {getSignalLabel(getSignalLevel(tooltip.innovation))}
              </span>
              <span className="text-xs text-muted-foreground">
                Gap: {tooltip.innovation.need_score - tooltip.innovation.effective_demand_score}
              </span>
            </div>
            <p className="text-[10px] text-muted-foreground mt-1">{tooltip.innovation.evidence_date}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
