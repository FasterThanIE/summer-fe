import type {
  Agency,
  Deal,
  DestinationRegion,
  FilterSection,
  Property,
  PropertyDetail,
  SavedSearch,
  SummaryChip,
} from "./types";

const AGENCIES = {
  sunce: { name: "Sunce Travel", initials: "ST", color: "#f2b600" },
  plavi: { name: "Plavi Talas", initials: "PT", color: "#1f7fc4" },
  mediteran: { name: "Mediteran Plus", initials: "MP", color: "#e0663a" },
  egejski: { name: "Egejski Horizont", initials: "EH", color: "#1a9e8f" },
  jonski: { name: "Jonski Biser", initials: "JB", color: "#8a5cd1" },
} satisfies Record<string, Agency>;

export const EXAMPLE_QUERIES = [
  "Naksos, avgust, 7 dana za dvoje",
  "Halkidiki sa decom do 1200 EUR",
  "Krf, apartman blizu plaze",
];

export const DEALS: Deal[] = [
  { img: "/img/p_cove.jpg", place: "Halkidiki · Kasandra", title: "Halkidiki 10 dana sa decom", meta: ["2 + 2 dece", "Autobus", "Apartman 50 m od plaze"], price: "800", tag: "Najtrazenije" },
  { img: "/img/p_moon.jpg", place: "Santorini · Oia", title: "Santorini 7 dana za dvoje", meta: ["2 osobe", "Avion", "Pogled na kalderu"], price: "1.150", tag: "Za parove" },
  { img: "/img/p_hill.jpg", place: "Krf · Sidari", title: "Krf 10 dana, more i zelenilo", meta: ["2 osobe", "Autobus + trajekt", "Studio"], price: "640", tag: "-15%" },
  { img: "/img/p_sky.jpg", place: "Tasos · Limenas", title: "Tasos 9 noci, porodicno", meta: ["2 + 1 dete", "Sopstveni prevoz", "Vila sa bazenom"], price: "520", tag: "Last minute" },
  { img: "/img/p_turq.jpg", place: "Krit · Hanja", title: "Krit 8 dana all inclusive", meta: ["2 osobe", "Avion", "All inclusive"], price: "1.290", tag: "All inclusive" },
  { img: "/img/p_island.jpg", place: "Lefkada · Nidri", title: "Lefkada 10 dana uz tirkizno more", meta: ["2 osobe", "Autobus", "Apartman"], price: "590", tag: "Novo" },
];

export const PROPERTIES: Property[] = [
  {
    slug: "lefkada-turquoise", name: "Lefkada Turquoise", img: "/img/p_turq.jpg", stars: 4, place: "Nidri", city: "Nidri", region: "Lefkada",
    typeLabel: "Duplex", beach: "220 m", cap: 6,
    amenities: [{ icon: "wifi", label: "WiFi" }, { icon: "ac", label: "Klima" }, { icon: "pool", label: "Bazen" }],
    room: "Duplex za 6 osoba", beds: "2 spavace sobe na spratu, 2 kupatila", agency: AGENCIES.sunce, offer: "First minute",
    inBudget: false, discount: "-15%", score: 9.4, scoreLabel: "Izuzetno", reviews: "141",
    priceFor: "7 noci · 2 odrasla", oldTotal: "973", total: "826", perNight: "118",
  },
  {
    slug: "vila-kalimera", name: "Vila Kalimera", img: "/img/p_shore.jpg", stars: 3, place: "Kasandra", city: "Kasandra", region: "Halkidiki",
    typeLabel: "Apartman", beach: "80 m", cap: 4,
    amenities: [{ icon: "wifi", label: "WiFi" }, { icon: "ac", label: "Klima" }],
    room: "Apartman za 4 osobe", beds: "1 spavaca soba, 1 bracni + 2 kreveta u dnevnoj", agency: AGENCIES.plavi, offer: "First minute",
    inBudget: true, discount: "-15%", score: 8.6, scoreLabel: "Vrlo dobro", reviews: "412",
    priceFor: "7 noci · 2 odrasla", oldTotal: "644", total: "546", perNight: "78",
  },
  {
    slug: "aegean-blue-studios", name: "Aegean Blue Studios", img: "/img/p_clear.jpg", stars: 3, place: "Sitonija, Nikiti", city: "Nikiti", region: "Halkidiki",
    typeLabel: "Studio", beach: "150 m", cap: 4,
    amenities: [{ icon: "wifi", label: "WiFi" }, { icon: "ac", label: "Klima" }, { icon: "pool", label: "Bazen" }],
    room: "Porodicni studio", beds: "1 bracni + 2 singl kreveta, cajna kuhinja", agency: AGENCIES.sunce, offer: "Last minute",
    inBudget: true, discount: null, score: 9.1, scoreLabel: "Odlicno", reviews: "268",
    priceFor: "7 noci · 2 odrasla", oldTotal: null, total: "672", perNight: "96",
  },
  {
    slug: "corfu-olive-garden", name: "Corfu Olive Garden", img: "/img/p_hill.jpg", stars: 4, place: "Sidari", city: "Sidari", region: "Krf",
    typeLabel: "Apartman", beach: "600 m", cap: 3,
    amenities: [{ icon: "wifi", label: "WiFi" }, { icon: "ac", label: "Klima" }, { icon: "pool", label: "Bazen" }],
    room: "Apartman sa pogledom na vrt", beds: "1 spavaca soba, sofa na razvlacenje", agency: AGENCIES.egejski, offer: "First minute",
    inBudget: false, discount: "-15%", score: 8.8, scoreLabel: "Odlicno", reviews: "187",
    priceFor: "7 noci · 2 odrasla", oldTotal: "728", total: "616", perNight: "88",
  },
  {
    slug: "hotel-poseidon-paralia", name: "Hotel Poseidon Paralia", img: "/img/p_strip.jpg", stars: 3, place: "Paralija", city: "Paralija", region: "Olimpska rivijera",
    typeLabel: "Hotelska soba", beach: "350 m", cap: 4,
    amenities: [{ icon: "wifi", label: "WiFi" }, { icon: "ac", label: "Klima" }],
    room: "Cetvorokrevetna soba", beds: "2 bracna kreveta", agency: AGENCIES.mediteran, offer: null,
    inBudget: true, discount: "-15%", score: 7.9, scoreLabel: "Dobro", reviews: "903",
    priceFor: "7 noci · 2 odrasla", oldTotal: "525", total: "448", perNight: "64",
  },
];

export const RESULTS_SUMMARY: SummaryChip[] = [
  { icon: "moon", label: "7 noci" },
  { icon: "users", label: "2 odrasla" },
  { icon: "calendar", label: "jul" },
  { icon: "wallet", label: "do 1.000 EUR" },
];

export const SAVED_SEARCHES: SavedSearch[] = [
  { name: "Halkidiki · 10 dana · Jul", summary: "9 noci · 2 odrasla, 2 dece" },
  { name: "Krf · 8 dana", summary: "7 noci · 2 odrasla" },
];

export const DESTINATIONS: DestinationRegion[] = [
  { region: "Halkidiki", count: 5, checked: false, open: true, cities: [
    { name: "Kasandra", count: 1, checked: true }, { name: "Nikiti", count: 1, checked: false }, { name: "Pefkohori", count: 1, checked: false },
    { name: "Nea Kalikratia", count: 1, checked: false }, { name: "Sarti", count: 1, checked: false },
  ] },
  { region: "Olimpska rivijera", count: 2, checked: false, open: false, cities: [{ name: "Paralija", count: 1, checked: false }, { name: "Asprovalta", count: 1, checked: false }] },
  { region: "Krf", count: 2, checked: false, open: false, cities: [{ name: "Sidari", count: 1, checked: false }, { name: "Kasiopi", count: 1, checked: false }] },
  { region: "Tasos", count: 1, checked: false, open: false, cities: [{ name: "Limenas", count: 1, checked: false }] },
  { region: "Lefkada", count: 1, checked: false, open: false, cities: [{ name: "Nidri", count: 1, checked: false }] },
  { region: "Krit", count: 1, checked: false, open: false, cities: [{ name: "Hanja", count: 1, checked: false }] },
  { region: "Santorini", count: 1, checked: false, open: false, cities: [{ name: "Oia", count: 1, checked: false }] },
];

export const FILTER_SECTIONS: FilterSection[] = [
  { name: "dist", legend: "Udaljenost od plaze", options: [
    { value: "near", label: "Blizu", sub: "do 200 m", icon: "beach", count: 7, checked: true },
    { value: "mid", label: "Relativno blizu", sub: "200 – 500 m", icon: "walk", count: 4 },
    { value: "far", label: "Daleko", sub: "vise od 500 m", icon: "car", count: 4 },
  ] },
  { name: "amen", legend: "Sadrzaji", options: [
    { value: "wifi", label: "WiFi", icon: "wifi", count: 14 },
    { value: "ac", label: "Klima", icon: "ac", count: 13 },
    { value: "pool", label: "Bazen", icon: "pool", count: 7 },
  ] },
  { name: "type", legend: "Tip smestaja", options: [
    { value: "apartman", label: "Apartman", sub: "odvojena spavaca soba", icon: "apartment", count: 4 },
    { value: "studio", label: "Studio", sub: "jedna prostorija sa kuhinjom", icon: "studio", count: 4 },
    { value: "duplex", label: "Duplex", sub: "smestaj na dva nivoa", icon: "duplex", count: 3 },
  ] },
  { name: "offer", legend: "Ponude", options: [
    { value: "first", label: "First minute", sub: "rana rezervacija", icon: "clock", count: 5 },
    { value: "last", label: "Last minute", sub: "polasci uskoro", icon: "boltOutline", count: 6 },
    { value: "popust", label: "Popust", sub: "snizena cena", icon: "tag", count: 7 },
  ] },
  { name: "agency", legend: "Agencije", options: Object.values(AGENCIES).map((a) => ({
    value: a.name, label: a.name, logo: { text: a.initials, color: a.color }, count: 3,
  })) },
];

const PERIODS = [
  { from: "23.05.", to: "02.06." }, { from: "02.06.", to: "12.06." }, { from: "12.06.", to: "22.06." }, { from: "22.06.", to: "02.07." },
  { from: "02.07.", to: "12.07." }, { from: "12.07.", to: "22.07." }, { from: "22.07.", to: "01.08." }, { from: "01.08.", to: "11.08." },
];

export const PROPERTY_DETAIL: PropertyDetail = {
  property: PROPERTIES[0],
  photos: ["/img/p_turq.jpg", "/img/p_cove.jpg", "/img/p_sail.jpg", "/img/p_island.jpg", "/img/p_clear.jpg"],
  agency: { ...AGENCIES.sunce, city: "Beograd", score: "9.2", reviews: "3.140", listings: 3, years: 17 },
  description: [
    "Lefkada Turquoise je duplex u mestu Nidri (Lefkada), na 220 m od plaze, sto je kratka setnja kroz mesto. Smestaj prima do 6 osoba i idealan je za porodice sa decom i manje grupe prijatelja.",
    "Duplex za 6 osoba: 2 spavace sobe na spratu, 2 kupatila. Gostima je na raspolaganju bazen sa lezaljkama i suncobranima. Sve sobe imaju klimu, a besplatan WiFi radi u celom objektu.",
    "U blizini su pekare, market i taverne sa svezom ribom. Ponudu organizuje agencija Sunce Travel, koja je na raspolaganju pre i tokom putovanja.",
  ],
  highlights: [
    { icon: "beach", title: "220 m", sub: "do plaze" },
    { icon: "users", title: "do 6 osoba", sub: "Duplex" },
    { icon: "star", title: "9.4 / 10", sub: "Izuzetno" },
  ],
  amenities: [
    { icon: "wifi", label: "WiFi", available: true },
    { icon: "ac", label: "Klima", available: true },
    { icon: "pool", label: "Bazen", available: true },
    { icon: "parking", label: "Besplatan parking", available: true },
    { icon: "kitchen", label: "Kuhinja", available: true },
    { icon: "tv", label: "TV", available: true },
    { icon: "sun", label: "Terasa ili balkon", available: true },
    { icon: "sparkle", label: "Ciscenje svaka 3 dana", available: true },
    { icon: "bed", label: "Posteljina i peskiri", available: false },
  ],
  unitTags: ["do 6 osoba", "Klima", "Kuhinja", "Terasa"],
  nearby: [["Plaza", "220 m"], ["Centar mesta", "600 m"], ["Market", "200 m"], ["Taverna", "140 m"], ["Apoteka", "540 m"], ["Najblizi aerodrom", "74 km"]],
  subscores: [["Cistoca", 9.6], ["Lokacija", 9.7], ["Domacini", 9.6], ["Udobnost", 9.4], ["Odnos cene i kvaliteta", 9.1], ["WiFi", 9.0]],
  reviews: [
    { text: "Domacini su sjajni, a pogled sa terase je vredan svakog evra.", author: "Marko, putovao sa partnerkom" },
    { text: "Lokacija je savrsena, plaza je bukvalno preko puta.", author: "Nikola, putovao sa porodicom" },
  ],
  rules: [["Prijava", "od 14:00"], ["Odjava", "do 10:00"], ["Kucni ljubimci", "Dozvoljeni uz najavu"], ["Otkazivanje", "Besplatno do 30 dana pre polaska"]],
  packageLabel: "Paket sa autobusom",
  included: "10 nocenja, autobuski prevoz u paket varijanti, zavrsno ciscenje, posteljinu i peskire.",
  excluded: "Boravisnu taksu (placa se na licu mesta), putno osiguranje i fakultativne izlete.",
  priceTable: {
    heading: "Paket aranzman (smestaj u duplex apartmanu i autobuski prevoz)",
    periods: PERIODS,
    selectedColumn: 4,
    selectedRow: 0,
    rows: [
      { label: "1/2 DUPLEX", aux: "–", paying: 2, cells: [
        { price: 670, promo: true, cheapest: true }, { price: 845 }, { price: 1035 }, null, { price: 1140, selected: true }, { price: 1225 }, { price: 1340 }, { price: 1385 },
      ] },
      { label: "1/3 DUPLEX", aux: "–", paying: 3, cells: [
        { price: 450, promo: true, cheapest: true }, { price: 575 }, { price: 695 }, { price: 740 }, { price: 770 }, null, { price: 900 }, { price: 925 },
      ] },
      { label: "1/4 DUPLEX", aux: "–", paying: 4, cells: [
        { price: 340, promo: true, cheapest: true }, { price: 435 }, { price: 520 }, { price: 555 }, { price: 580 }, { price: 620 }, { price: 675 }, { price: 695 },
      ] },
      { label: "1/4+1 DUPLEX", aux: "1 (dete do 12 god.)", paying: 4, cells: [
        { price: 320, promo: true, cheapest: true }, { price: 405 }, { price: 485 }, { price: 515 }, null, { price: 575 }, { price: 625 }, { price: 645 },
      ] },
    ],
  },
  priceSummary: {
    term: "02.07. – 12.07.",
    nights: "10 noci",
    lines: [["Struktura", "1/2 DUPLEX"], ["Vrsta ponude", "Paket sa autobusom"], ["Cena po osobi", "1.140 EUR"], ["Platnih osoba", "× 2"]],
    total: "2.280",
    oldTotal: "2.685",
    totalFor: "Ukupno za 2 osobe",
    note: "Besplatno otkazivanje do 30 dana pre polaska",
  },
};
