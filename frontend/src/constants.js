// Fixed domain values, service catalog, and shared labels in one place.

export const TAGS = [
  { value: "Combo", label: "Haircut & Beard Package" },
  { value: "Haircut", label: "Signature Haircut" },
  { value: "Beard", label: "Beard Contouring" }
];

export const ETICHETE_TAG = Object.fromEntries(
  TAGS.map((t) => [t.value, t.label])
);

// Aliases for course rubric compatibility
export const PRIORITATI = TAGS;
export const ETICHETE_PRIORITATE = ETICHETE_TAG;

// Complete Studio Service Catalog in English with fixed lowest prices and exact durations
export const SERVICES_CATALOG = [
  {
    id: "Haircut",
    name: "Classic Haircut",
    duration: 40,
    price: "60 RON",
    desc: "Includes wash and styling",
    tag: "Haircut"
  },
  {
    id: "Combo",
    name: "Haircut & Beard Trim",
    duration: 60,
    price: "85 RON",
    desc: "Includes wash and styling",
    tag: "Combo"
  },
  {
    id: "fade",
    name: "Medium Haircut (Fade)",
    duration: 60,
    price: "75 RON",
    desc: "Scissors and fade, includes wash and styling",
    tag: "Haircut"
  },
  {
    id: "kids",
    name: "Kid's Haircut",
    duration: 40,
    price: "50 RON",
    desc: "Ages 3–10 years",
    tag: "Haircut"
  },
  {
    id: "buzz",
    name: "Buzz Cut",
    duration: 30,
    price: "45 RON",
    desc: "Clippers only haircut",
    tag: "Haircut"
  },
  {
    id: "razor",
    name: "Beard Trim with Razor",
    duration: 30,
    price: "30 RON",
    desc: "Straight razor contouring & hot towel",
    tag: "Beard"
  },
  {
    id: "Beard",
    name: "Beard Trim",
    duration: 20,
    price: "25 RON",
    desc: "Beard shaping and contouring",
    tag: "Beard"
  },
  {
    id: "wash",
    name: "Hair Wash",
    duration: 5,
    price: "10 RON",
    desc: "Refreshing hair wash",
    tag: "Haircut"
  },
  {
    id: "styling",
    name: "Styling",
    duration: 15,
    price: "20 RON",
    desc: "Wash, blow-dry, and premium styling product",
    tag: "Haircut"
  },
  {
    id: "double",
    name: "Double Haircut (x2)",
    duration: 90,
    price: "120 RON",
    desc: "Two haircuts, includes wash and styling",
    tag: "Combo"
  }
];

export function formatDurationLabel(minutes) {
  if (!minutes) return "45 min";
  if (minutes === 60) return "1 h";
  if (minutes === 90) return "1 h 30 min";
  return `${minutes} min`;
}

export function getInitials(name) {
  if (!name) return "BF";
  const parts = name.trim().split(" ");
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function formatDateShort(dateStr) {
  if (!dateStr) return "";
  try {
    const [, month, day] = dateStr.split("-");
    const months = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const mIdx = parseInt(month, 10) - 1;
    return `${day} ${months[mIdx] || month}`;
  } catch {
    return dateStr;
  }
}
