export interface Unit {
  labelKey: string;
  value: string;
}

export interface Category {
  labelKey: string;
  value: string;
  units: Unit[];
}

export const productCategories: Category[] = [
  {
    labelKey: "categories.individual_count",
    value: "individual_count",
    units: [
      { labelKey: "units.PCS", value: "PCS" }, // Pieces
      { labelKey: "units.UNIT", value: "UNIT" }, // Unit
      { labelKey: "units.SET", value: "SET" }, // Set
      { labelKey: "units.PAIR", value: "PAIR" }, // Pair
    ],
  },
  {
    labelKey: "categories.grouping",
    value: "grouping",
    units: [
      { labelKey: "units.BDL", value: "BDL" }, // Bundle
      { labelKey: "units.BOX", value: "BOX" }, // Box
      { labelKey: "units.CRT", value: "CRT" }, // Crate
      { labelKey: "units.REEL", value: "REEL" }, // Reel
      { labelKey: "units.PACK", value: "PACK" }, // Pack
    ],
  },
  {
    labelKey: "categories.packaging",
    value: "packaging",
    units: [
      { labelKey: "units.ROLL", value: "ROLL" }, // Roll
      { labelKey: "units.SHEET", value: "SHEET" }, // Sheet
      { labelKey: "units.CAN", value: "CAN" }, // Can
      { labelKey: "units.BTL", value: "BTL" }, // Bottle
    ],
  },
  {
    labelKey: "categories.weight_based",
    value: "weight_based",
    units: [
      { labelKey: "units.KG", value: "KG" }, // Kilogram
      { labelKey: "units.G", value: "G" }, // Gram
      { labelKey: "units.LBS", value: "LBS" }, // Pounds
      { labelKey: "units.OZ", value: "OZ" }, // Ounce
      { labelKey: "units.TN", value: "TN" }, // Ton
    ],
  },
  {
    labelKey: "categories.volume_based",
    value: "volume_based",
    units: [
      { labelKey: "units.L", value: "L" }, // Litre
      { labelKey: "units.ML", value: "ML" }, // Millilitre
      { labelKey: "units.GALLON", value: "GALLON" }, // Gallon
      { labelKey: "units.LITER", value: "LITER" }, // Liter
    ],
  },
  {
    labelKey: "categories.length_based",
    value: "length_based",
    units: [
      { labelKey: "units.M", value: "M" }, // Meter
      { labelKey: "units.CM", value: "CM" }, // Centimeter
      { labelKey: "units.MM", value: "MM" }, // Millimeter
      { labelKey: "units.FT", value: "FT" }, // Foot
      { labelKey: "units.INCH", value: "INCH" }, // Inch
    ],
  },
  {
    labelKey: "categories.area_volume",
    value: "area_volume",
    units: [
      { labelKey: "units.SQM", value: "SQM" }, // Square Meter
      { labelKey: "units.SQFT", value: "SQFT" }, // Square Foot
      { labelKey: "units.CUBICMETER", value: "CUBICMETER" }, // Cubic Meter
      { labelKey: "units.CUBICFOOT", value: "CUBICFOOT" }, // Cubic Foot
    ],
  },
  {
    labelKey: "categories.hybrid",
    value: "hybrid",
    units: [
      { labelKey: "units.KGPK", value: "KGPK" }, // Kilo/Pack
      { labelKey: "units.MPK", value: "MPK" }, // Meter/Pack
    ],
  },
  // Removed 'electronic' category as its units have been reassigned
];
