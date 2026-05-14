import { Origin, Horoscope } from "circular-natal-horoscope-js";

export interface ChartPlacements {
  sun: { sign: string; house: number };
  moon: { sign: string; house: number };
  rising: string;
  mercury: { sign: string; house: number };
  venus: { sign: string; house: number };
  mars: { sign: string; house: number };
  jupiter: { sign: string; house: number };
  saturn: { sign: string; house: number };
  uranus: { sign: string; house: number };
  neptune: { sign: string; house: number };
  pluto: { sign: string; house: number };
  aspects: string[];
}

interface CelestialBody {
  label: string;
  Sign: { label: string };
  House: { label: string };
}

interface Aspect {
  point1Label: string;
  point2Label: string;
  aspectLabel: string;
}

async function geocodeLocation(
  location: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(location)}&format=json&limit=1`,
      { headers: { "User-Agent": "PersonalityOS/1.0" } }
    );
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
    return null;
  } catch {
    return null;
  }
}

function houseNumber(houseLabel: string): number {
  const match = houseLabel.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : 1;
}

export async function calculateChart(
  birthDate: string,
  birthTime: string,
  birthLocation: string
): Promise<ChartPlacements | null> {
  const coords = await geocodeLocation(birthLocation);
  if (!coords) return null;

  const [year, month, day] = birthDate.split("-").map(Number);
  let hour = 12;
  let minute = 0;
  if (birthTime) {
    const [h, m] = birthTime.split(":").map(Number);
    hour = h;
    minute = m;
  }

  const origin = new Origin({
    year,
    month: month - 1,
    date: day,
    hour,
    minute,
    latitude: coords.lat,
    longitude: coords.lng,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies"],
    aspectWithPoints: ["bodies"],
    aspectTypes: ["major"],
    language: "en",
  });

  const bodies: Record<string, CelestialBody> = {};
  for (const body of horoscope.CelestialBodies.all as CelestialBody[]) {
    bodies[body.label.toLowerCase()] = body;
  }

  const sunBody = bodies["sun"];
  const moonBody = bodies["moon"];
  const ascendant = horoscope.Ascendant as { Sign: { label: string } } | undefined;

  const getPlacement = (name: string) => {
    const b = bodies[name];
    if (!b) return { sign: "Unknown", house: 1 };
    return {
      sign: b.Sign.label,
      house: houseNumber(b.House.label),
    };
  };

  const aspects: string[] = [];
  const majorAspects = horoscope.Aspects?.all ?? [];
  for (const aspect of majorAspects as Aspect[]) {
    if (aspect.point1Label && aspect.point2Label && aspect.aspectLabel) {
      aspects.push(
        `${aspect.point1Label} ${aspect.aspectLabel} ${aspect.point2Label}`
      );
    }
  }

  return {
    sun: { sign: sunBody?.Sign.label ?? "Unknown", house: houseNumber(sunBody?.House.label ?? "1") },
    moon: { sign: moonBody?.Sign.label ?? "Unknown", house: houseNumber(moonBody?.House.label ?? "1") },
    rising: ascendant?.Sign?.label ?? "Unknown",
    mercury: getPlacement("mercury"),
    venus: getPlacement("venus"),
    mars: getPlacement("mars"),
    jupiter: getPlacement("jupiter"),
    saturn: getPlacement("saturn"),
    uranus: getPlacement("uranus"),
    neptune: getPlacement("neptune"),
    pluto: getPlacement("pluto"),
    aspects: aspects.slice(0, 10),
  };
}

export function formatChartForPrompt(chart: ChartPlacements): string {
  const lines = [
    `VERIFIED ASTROLOGICAL CHART (calculated via ephemeris — these are accurate):`,
    `Sun: ${chart.sun.sign} in the ${ordinal(chart.sun.house)} house`,
    `Moon: ${chart.moon.sign} in the ${ordinal(chart.moon.house)} house`,
    `Rising/Ascendant: ${chart.rising}`,
    `Mercury: ${chart.mercury.sign} in the ${ordinal(chart.mercury.house)} house`,
    `Venus: ${chart.venus.sign} in the ${ordinal(chart.venus.house)} house`,
    `Mars: ${chart.mars.sign} in the ${ordinal(chart.mars.house)} house`,
    `Jupiter: ${chart.jupiter.sign} in the ${ordinal(chart.jupiter.house)} house`,
    `Saturn: ${chart.saturn.sign} in the ${ordinal(chart.saturn.house)} house`,
    `Uranus: ${chart.uranus.sign} in the ${ordinal(chart.uranus.house)} house`,
    `Neptune: ${chart.neptune.sign} in the ${ordinal(chart.neptune.house)} house`,
    `Pluto: ${chart.pluto.sign} in the ${ordinal(chart.pluto.house)} house`,
  ];

  if (chart.aspects.length > 0) {
    lines.push(`Major aspects: ${chart.aspects.join(", ")}`);
  }

  return lines.join("\n");
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}
