type Market = { code: string; city: string; country: string; suburbs: string[] };

export const markets: Market[] = [
  { code: "jhb", city: "Johannesburg", country: "South Africa", suburbs: ["Sandhurst","Hyde Park","Bryanston","Morningside","Bedfordview","Melrose Arch"] },
  { code: "cpt", city: "Cape Town", country: "South Africa", suburbs: ["Clifton","Bantry Bay","Camps Bay","Bishopscourt","Constantia","Fresnaye","Sea Point"] },
  { code: "dbn", city: "Durban", country: "South Africa", suburbs: ["Umhlanga","La Lucia","Durban North","Ballito","Zimbali"] },
  { code: "pta", city: "Pretoria", country: "South Africa", suburbs: ["Waterkloof","Brooklyn","Lynnwood","Silver Lakes","Faerie Glen"] },
  { code: "bkk", city: "Bangkok", country: "Thailand", suburbs: ["Thonglor","Ekkamai","Phrom Phong","Sathorn"] },
  { code: "phk", city: "Phuket", country: "Thailand", suburbs: ["Surin","Laguna","Kamala","Kata Noi"] },
  { code: "ber", city: "Berlin", country: "Germany", suburbs: ["Grunewald","Zehlendorf","Charlottenburg"] },
  { code: "muc", city: "Munich", country: "Germany", suburbs: ["Bogenhausen","Schwabing","Lehel"] },
  { code: "lon", city: "London", country: "United Kingdom", suburbs: ["Mayfair","Knightsbridge","Chelsea","Kensington","Belgravia"] },
  { code: "nyc", city: "New York", country: "USA", suburbs: ["Upper East Side","SoHo","Tribeca","Greenwich Village"] },
  { code: "la", city: "Los Angeles", country: "USA", suburbs: ["Beverly Hills","Bel Air","Malibu","Brentwood"] },
  { code: "mia", city: "Miami", country: "USA", suburbs: ["Brickell","Coral Gables","Key Biscayne","Sunny Isles"] },
  { code: "tok", city: "Tokyo", country: "Japan", suburbs: ["Minato","Aoyama","Azabu","Shibuya"] }
];

export const sites = [
  {
    domain: "vaughnsterling.com",
    brand: "Vaughn Sterling",
    niche: "elite male companion",
    tone: "luxury, discreet, concierge-level",
    primaryMarketCodes: ["jhb","cpt","dbn","pta","lon","nyc","la"],
    keywords: ["male escort for ladies","elite companion","private dinner date","vip travel companion","Johannesburg male escort","Cape Town male companion"]
  },
  {
    domain: "vaughnsterlingtours.com",
    brand: "Vaughn Sterling Tours",
    niche: "luxury hosted tours + companionship",
    tone: "bespoke travel, safety-first, white-glove",
    primaryMarketCodes: ["cpt","bkk","phk","nyc","lon"],
    keywords: ["luxury private guide","bespoke city tour","vip nightlife host","couples tour escort"]
  },
  {
    domain: "swankyboyz.com",
    brand: "Swanky Boyz",
    niche: "curated male companions marketplace",
    tone: "modern, bold, inclusive",
    primaryMarketCodes: ["jhb","cpt","dbn","lon","nyc","tok"],
    keywords: ["rent men","male companion service","vip gentlemen escorts","luxury date night"]
  }
];
