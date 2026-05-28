export const images = {
  heroCoconut: "/assets/tenderlyte/hero-coconut.png",
  coconutSplit: "/assets/tenderlyte/coconut-split.png",
  lab: "/assets/tenderlyte/lab.png",
  athlete: "/assets/tenderlyte/athlete.png",
  work: "/assets/tenderlyte/work.png",
  molecule: "/assets/tenderlyte/molecule.png",
  droplets: "/assets/tenderlyte/droplets.png",
  plantation: "/assets/tenderlyte/plantation.png",
  coconutTree: "/assets/tenderlyte/coconut-tree.png",
  farmer: "/assets/tenderlyte/farmer.png",
  filling: "/assets/tenderlyte/filling.png",
  sunset: "/assets/tenderlyte/sunset.png",
  dropletHero: "/assets/tenderlyte/droplet-hero.png",
  jungleMist: "/assets/tenderlyte/jungle-mist.png",
  coconutConcept: "/assets/tenderlyte/coconut-concept.png",
  cracked: "/assets/tenderlyte/cracked.png",
  handPicked: "/assets/tenderlyte/hand-picked.png",
  process: "/assets/tenderlyte/process.png",
  bottle: "/assets/tenderlyte/bottle.png"
} as const;

export const navItems = [
  { href: "#showcase", label: "Showcase" },
  { href: "#purity", label: "Purity" },
  { href: "#story", label: "Story" },
  { href: "#lifestyle", label: "Lifestyle" },
  { href: "#contact", label: "Contact" }
] as const;

export const showcaseFeatures = [
  ["bolt", "Natural Electrolytes", "Bio-available minerals for instant cellular recovery and peak cognitive performance.", "bg-[#c9ff35] text-[#536d00]"],
  ["water_drop", "No Added Sugar", "Pure, unadulterated hydration with a naturally sweet profile from heritage palms.", "bg-[#d9ef77] text-[#425800]"],
  ["energy_savings_leaf", "Fresh Daily", "Harvested every 24 hours to ensure the enzymatic vitality of our signature water.", "bg-[#bfe566] text-[#2f4600]"],
  ["package_2", "Eco-Purity", "100% recyclable Tetra Pak packaging designed to block UV rays and preserve taste.", "bg-[#e9ff92] text-[#536d00]"]
] as const;

export const minerals = [
  ["Potassium", "690mg"],
  ["Magnesium", "60mg"],
  ["Sodium", "45mg"],
  ["Calcium", "58mg"]
] as const;

export const storyCards = [
  ["Direct Farmer Equity", "Our pricing model guarantees 40% above market value, allowing our farming communities to thrive and invest in their local education systems."],
  ["100% Traceable", "Scan your pack to see exactly which farm your water came from."],
  ["Education Fund", "5% of every sale goes directly to the TenderLyte Scholars initiative in India."],
  ["Biodiversity Protection", "We protect 2 acres of rainforest for every 1 acre of coconut plantation we manage."]
] as const;

export const cartVariants = [
  {
    id: "tenderlyte-single",
    name: "TenderLyte Single",
    description: "One bottle of premium TenderLyte.",
    accent: "bg-[#d9ef77] text-[#425800]"
  },
  {
    id: "tenderlyte-12-pack",
    name: "TenderLyte 12-Pack",
    description: "Single premium product in a 12-pack format.",
    accent: "bg-[#c9ff35] text-[#536d00]"
  }
] as const;
