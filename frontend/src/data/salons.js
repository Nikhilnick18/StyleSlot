
const salons = [
  {
    id: 1,
    name: "The Modern Man",
    slug: "the-modern-man",
    location: "Connaught Place, New Delhi",
    area: "Connaught Place",
    category: "Barber",
    rating: 4.9,
    reviewCount: 128,
    startingPrice: 299,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Trim", "Hair Styling"],
    description: "A contemporary grooming studio for classic cuts and modern styles."
  },
  {
    id: 2,
    name: "House of Hair",
    slug: "house-of-hair",
    location: "South Extension, New Delhi",
    area: "South Extension",
    category: "Salon",
    rating: 4.8,
    reviewCount: 96,
    startingPrice: 499,
    image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Hair Spa"],
    description: "A modern salon offering everyday styling and hair treatments."
  },
  {
    id: 3,
    name: "The Gentlemen's Club",
    slug: "the-gentlemens-club",
    location: "Lajpat Nagar, New Delhi",
    area: "Lajpat Nagar",
    category: "Barber",
    rating: 4.7,
    reviewCount: 84,
    startingPrice: 249,
    image: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Trim", "Head Massage"],
    description: "A relaxed neighbourhood barbershop focused on men's grooming."
  },
  {
    id: 4,
    name: "Olive Studio",
    slug: "olive-studio",
    location: "Defence Colony, New Delhi",
    area: "Defence Colony",
    category: "Salon",
    rating: 4.8,
    reviewCount: 112,
    startingPrice: 599,
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Styling"],
    description: "A design-led salon with a calm atmosphere and personalised styling."
  },
  {
    id: 5,
    name: "Blade & Brush",
    slug: "blade-and-brush",
    location: "Rajouri Garden, New Delhi",
    area: "Rajouri Garden",
    category: "Barber",
    rating: 4.6,
    reviewCount: 73,
    startingPrice: 199,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Styling", "Shave"],
    description: "A contemporary barbershop for sharp cuts and everyday grooming."
  },
  {
    id: 6,
    name: "The Hair Edit",
    slug: "the-hair-edit",
    location: "Dwarka Sector 12, New Delhi",
    area: "Dwarka",
    category: "Salon",
    rating: 4.7,
    reviewCount: 67,
    startingPrice: 399,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Blow Dry"],
    description: "A friendly salon for fresh cuts, colour and polished everyday looks."
  },
  {
    id: 7,
    name: "Urban Trim",
    slug: "urban-trim",
    location: "Noida Sector 18, Noida",
    area: "Noida Sector 18",
    category: "Barber",
    rating: 4.8,
    reviewCount: 143,
    startingPrice: 299,
    image: "https://images.unsplash.com/photo-1512690459411-b9245aed614b?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Trim", "Hair Wash"],
    description: "A modern grooming spot in the heart of Noida's shopping district."
  },
  {
    id: 8,
    name: "Mane Avenue",
    slug: "mane-avenue",
    location: "Indirapuram, Ghaziabad",
    area: "Indirapuram",
    category: "Salon",
    rating: 4.6,
    reviewCount: 59,
    startingPrice: 449,
    image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Styling"],
    description: "A neighbourhood salon for cuts, colour and special-occasion styling."
  },
  {
    id: 9,
    name: "Sharp Society",
    slug: "sharp-society",
    location: "Gurugram Sector 29, Gurugram",
    area: "Gurugram Sector 29",
    category: "Barber",
    rating: 4.9,
    reviewCount: 156,
    startingPrice: 399,
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Styling", "Shave"],
    description: "A sharp, contemporary grooming concept for modern professionals."
  },
  {
    id: 10,
    name: "Bare & Beautiful",
    slug: "bare-and-beautiful",
    location: "Malviya Nagar, New Delhi",
    area: "Malviya Nagar",
    category: "Salon",
    rating: 4.7,
    reviewCount: 88,
    startingPrice: 549,
    image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Styling"],
    description: "A welcoming salon with a focus on personalised hair services."
  },
  {
    id: 11,
    name: "Cut Culture",
    slug: "cut-culture",
    location: "New Ashok Nagar, New Delhi",
    area: "New Ashok Nagar",
    category: "Barber",
    rating: 4.5,
    reviewCount: 42,
    startingPrice: 149,
    image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Beard Trim", "Hair Wash"],
    description: "An affordable sample listing for everyday cuts and grooming."
  },
  {
    id: 12,
    name: "Form & Finish",
    slug: "form-and-finish",
    location: "Greater Kailash, New Delhi",
    area: "Greater Kailash",
    category: "Salon",
    rating: 4.8,
    reviewCount: 105,
    startingPrice: 699,
    image: "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=900&q=85",
    services: ["Haircut", "Hair Colour", "Styling"],
    description: "A premium sample salon concept for refined styling experiences."
  }
];

const extraSalonData = [
  ["The Groom Room", "the-groom-room", "Karol Bagh", "Barber", 4.7, 91, 249],
  ["Studio Aura", "studio-aura", "Saket", "Salon", 4.8, 118, 599],
  ["Classic Cuts", "classic-cuts", "Patel Nagar", "Barber", 4.5, 54, 199],
  ["The Style Lounge", "the-style-lounge", "Vasant Kunj", "Salon", 4.9, 137, 799],
  ["Fade Factory", "fade-factory", "Janakpuri", "Barber", 4.7, 82, 299],
  ["Gloss & Glow", "gloss-and-glow", "Pitampura", "Salon", 4.8, 104, 499],
  ["The Hair Station", "the-hair-station", "Rohini", "Salon", 4.6, 76, 349],
  ["Kings & Queens", "kings-and-queens", "Preet Vihar", "Salon", 4.7, 89, 449],
  ["The Barber Hub", "the-barber-hub", "Mayur Vihar", "Barber", 4.5, 63, 199],
  ["Mirror Magic", "mirror-magic", "Shahdara", "Salon", 4.6, 71, 399],
  ["Style District", "style-district", "Dwarka Sector 10", "Salon", 4.8, 110, 499],
  ["Trim Theory", "trim-theory", "Palam", "Barber", 4.6, 58, 199],
  ["The Hair Canvas", "the-hair-canvas", "Vikaspuri", "Salon", 4.7, 95, 449],
  ["Urban Scissors", "urban-scissors", "Nehru Place", "Barber", 4.8, 121, 299],
  ["Velvet Touch", "velvet-touch", "Green Park", "Salon", 4.9, 142, 699],
  ["The Cutting Edge", "the-cutting-edge", "Kalkaji", "Barber", 4.6, 67, 249],
  ["Blush & Bloom", "blush-and-bloom", "East of Kailash", "Salon", 4.8, 98, 599],
  ["Scissor Stories", "scissor-stories", "Noida Sector 15", "Salon", 4.6, 73, 349],
  ["The Fade Lounge", "the-fade-lounge", "Noida Sector 16", "Barber", 4.8, 116, 299],
  ["Hair Republic", "hair-republic", "Noida Sector 50", "Salon", 4.7, 93, 499],
  ["The Style Bar", "the-style-bar", "Noida Sector 62", "Salon", 4.9, 132, 599],
  ["Beard Theory", "beard-theory", "Noida Sector 137", "Barber", 4.6, 69, 249],
  ["Crown Studio", "crown-studio", "Noida Sector 104", "Salon", 4.8, 107, 549],
  ["The Hair Project", "the-hair-project", "Greater Noida Alpha 1", "Salon", 4.6, 65, 399],
  ["Urban Clippers", "urban-clippers", "Greater Noida Pari Chowk", "Barber", 4.7, 87, 249],
  ["Glow Theory", "glow-theory", "Greater Noida Knowledge Park", "Salon", 4.5, 52, 349],
  ["The Grooming Co", "the-grooming-co", "Indirapuram", "Barber", 4.8, 124, 349],
  ["Mirror & Me", "mirror-and-me", "Vaishali", "Salon", 4.7, 89, 449],
  ["Style Avenue", "style-avenue", "Raj Nagar, Ghaziabad", "Salon", 4.6, 78, 399],
  ["The Barber Society", "the-barber-society", "Crossings Republik", "Barber", 4.5, 61, 199],
  ["Mane Street", "mane-street", "Gurugram Sector 56", "Salon", 4.8, 113, 599],
  ["The Grooming Lab", "the-grooming-lab", "Gurugram Cyber City", "Barber", 4.9, 145, 399],
  ["Chic & Shine", "chic-and-shine", "Gurugram Sector 14", "Salon", 4.7, 92, 499],
  ["Blade Theory", "blade-theory", "Gurugram Golf Course Road", "Barber", 4.8, 128, 449],
  ["The Beauty Edit", "the-beauty-edit", "Faridabad Sector 15", "Salon", 4.6, 74, 399],
  ["Sharp Looks", "sharp-looks", "Faridabad NIT", "Barber", 4.5, 57, 199],
  ["The Salon Room", "the-salon-room", "Faridabad Sector 21C", "Salon", 4.7, 86, 499],
  ["Cut & Colour Studio", "cut-and-colour-studio", "Gurugram Sector 31", "Salon", 4.8, 102, 549]
];

const extraImages = [
  "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=900&q=85"
];

const extraSalons = extraSalonData.map((item, index) => ({
  id: index + 13,
  name: item[0],
  slug: item[1],
  location: `${item[2]}, ${
    item[2].includes("Gurugram")
      ? "Gurugram"
      : item[2].includes("Noida") || item[2].includes("Greater Noida")
      ? "Noida"
      : item[2].includes("Ghaziabad")
      ? "Ghaziabad"
      : item[2].includes("Faridabad")
      ? "Faridabad"
      : "New Delhi"
  }`,
  area: item[2],
  category: item[3],
  rating: item[4],
  reviewCount: item[5],
  startingPrice: item[6],
  image: extraImages[index % extraImages.length],
  services:
    item[3] === "Barber"
      ? ["Haircut", "Beard Trim", "Hair Styling"]
      : ["Haircut", "Hair Colour", "Hair Spa"],
  description:
    item[3] === "Barber"
      ? "A modern neighbourhood grooming studio for fresh cuts and everyday styling."
      : "A contemporary salon offering personalised hair services and styling."
}));

salons.push(...extraSalons);

// OPENING HOURS FOR ALL 50 SALONS
salons.forEach((salon) => {
  salon.openingTime = "10:00 AM";
  salon.closingTime = "09:00 PM";
  salon.openingDays = "Monday - Sunday";
});

// SERVICE PRICES AND DURATIONS
const servicePricing = {
  "Haircut": { factor: 1, duration: 30 },
  "Beard Trim": { factor: 0.5, duration: 20 },
  "Beard Styling": { factor: 0.65, duration: 25 },
  "Hair Styling": { factor: 0.7, duration: 30 },
  "Styling": { factor: 0.8, duration: 30 },
  "Shave": { factor: 0.45, duration: 20 },
  "Hair Wash": { factor: 0.4, duration: 15 },
  "Head Massage": { factor: 0.6, duration: 25 },
  "Hair Colour": { factor: 2.5, duration: 90 },
  "Hair Spa": { factor: 1.8, duration: 60 },
  "Blow Dry": { factor: 0.7, duration: 30 }
};

salons.forEach((salon) => {
  salon.services = salon.services.map((service) => {
    const name =
      typeof service === "string" ? service : service.name;

    const details = servicePricing[name] || {
      factor: 1,
      duration: 30
    };

    const price = Math.round(
      (salon.startingPrice * details.factor) / 10
    ) * 10;

    return {
      name,
      price,
      duration: details.duration
    };
  });
});

export default salons;
