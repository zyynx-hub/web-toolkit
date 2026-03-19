export const BUSINESS = {
  name: "Brenda's Hairstyle",
  phone: "045 - 511 74 76",
  phoneHref: "tel:0455117476",
  address: "Akerstraat-Noord 224",
  city: "Hoensbroek",
  postalCode: "6431 HT",
  facebookUrl: "https://www.facebook.com/brendashairstyle",
  mapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2519.5!2d5.932!3d50.895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c0e9a0a0a0a0a0%3A0x0!2sAkerstraat-Noord+224%2C+6431+HT+Hoensbroek!5e0!3m2!1snl!2snl!4v1",
} as const

export type DaySchedule = [number, number] | null

export const SCHEDULE: Record<number, DaySchedule> = {
  0: null,  // Sunday
  1: null,  // Monday
  2: [9, 18],
  3: [9, 18],
  4: [9, 18],
  5: [9, 18],
  6: [9, 16],
}

export const DAYS = [
  { key: 1, name: "Maandag" },
  { key: 2, name: "Dinsdag" },
  { key: 3, name: "Woensdag" },
  { key: 4, name: "Donderdag" },
  { key: 5, name: "Vrijdag" },
  { key: 6, name: "Zaterdag" },
  { key: 0, name: "Zondag" },
] as const

export interface PriceItem {
  name: string
  note?: string
  price: string
  from?: boolean
}

export interface PriceCategory {
  id: string
  label: string
  items: PriceItem[]
}

export const PRICE_CATEGORIES: PriceCategory[] = [
  {
    id: "dames",
    label: "Dames",
    items: [
      { name: "Knippen en drogen", price: "€20,50" },
      { name: "Pony knippen", price: "€5,00" },
      { name: "Föhnen", price: "€22,50", from: true },
      { name: "Watergolf", price: "€22,50" },
      { name: "Stijlen", price: "€19,50", from: true },
      { name: "Krullen", price: "€22,50", from: true },
      { name: "Opsteken", price: "€29,50", from: true },
      { name: "Vlechten", price: "€15,00", from: true },
    ],
  },
  {
    id: "heren",
    label: "Heren",
    items: [
      { name: "Knippen", price: "€20,50" },
      { name: "Knippen + figuren inscheren", price: "€22,50", from: true },
      { name: "Tondeuse 1 lengte", price: "€15,00" },
      { name: "Tondeuse 2 lengtes", price: "€17,50" },
    ],
  },
  {
    id: "kids",
    label: "Kids",
    items: [
      { name: "Knippen", note: "Tot 12 jaar", price: "€14,50" },
      { name: "Knippen + figuren", note: "Tot 12 jaar", price: "€16,00", from: true },
    ],
  },
  {
    id: "verven",
    label: "Verven",
    items: [
      { name: "Uitgroei verven", price: "€35,50", from: true },
      { name: "Verven helemaal", price: "€39,50", from: true },
      { name: "Kleurspoeling", price: "€19,50", from: true },
      { name: "Folies high/lowlights", price: "€59,50", from: true },
      { name: "Blonderen", price: "€25,00", from: true },
      { name: "Coup soleil", price: "€19,50", from: true },
    ],
  },
  {
    id: "permanent",
    label: "Permanent",
    items: [
      { name: "Permanent", note: "Incl. knippen & drogen", price: "€79,50" },
      { name: "Permanent", note: "Incl. knippen + föhnen", price: "€89,50" },
    ],
  },
  {
    id: "extensions",
    label: "Extensions",
    items: [
      { name: "Extensions", note: "Per stuk", price: "€4,45" },
      { name: "Complete verlenging", note: "100 stuks", price: "€445,00" },
      { name: "Wave verlenging", price: "€445,00" },
      { name: "Wave opnieuw zetten", price: "€65,00" },
    ],
  },
  {
    id: "overig",
    label: "Overig",
    items: [
      { name: "Epileren", price: "€10,00" },
      { name: "Wenkbrauwen verven", price: "€10,00" },
    ],
  },
]

export const REVIEWS = [
  {
    initials: "SM",
    name: "Sandra M.",
    date: "2 maanden geleden",
    text: "Super tevreden! Brenda luistert echt naar wat je wilt en geeft altijd goed advies. Mijn haar ziet er elke keer prachtig uit.",
    stars: 5,
  },
  {
    initials: "LP",
    name: "Lisa P.",
    date: "1 maand geleden",
    text: "Al jaren vaste klant. Fijne sfeer, persoonlijke aandacht en altijd een mooi resultaat. De kinderen vinden het ook leuk om hier te komen!",
    stars: 5,
  },
  {
    initials: "NK",
    name: "Nicole K.",
    date: "3 weken geleden",
    text: "Beste kapper in de buurt! Goede prijzen, vakkundig en je voelt je echt welkom. Extensions zien er heel natuurlijk uit.",
    stars: 5,
  },
] as const

export const STATS = [
  { value: 15, suffix: "+", label: "Jaar ervaring" },
  { value: 5000, suffix: "+", label: "Tevreden klanten" },
  { value: 20, suffix: "+", label: "Behandelingen" },
  { value: 5, suffix: ".0", label: "Google score" },
] as const

export const MARQUEE_ITEMS = [
  "Knippen", "Verven", "Föhnen", "Extensions", "Permanent",
  "Opsteken", "Krullen", "Stijlen", "Blonderen", "Vlechten",
] as const

export const NAV_LINKS = [
  { href: "#over-ons", label: "Over ons" },
  { href: "#diensten", label: "Prijslijst" },
  { href: "#reviews", label: "Reviews" },
  { href: "#openingstijden", label: "Openingstijden" },
  { href: "#gallerij", label: "Salon" },
  { href: "#contact", label: "Contact" },
] as const
