// productUnits.ts

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
        { labelKey: "units.PCS", value: "PCS" },
        { labelKey: "units.EA", value: "EA" },
        { labelKey: "units.UN", value: "UN" }
      ]
    },
    {
      labelKey: "categories.grouping",
      value: "grouping",
      units: [
        { labelKey: "units.DZ", value: "DZ" },
        { labelKey: "units.GROSS", value: "GROSS" },
        { labelKey: "units.PR", value: "PR" },
        { labelKey: "units.SET", value: "SET" }
      ]
    },
    {
      labelKey: "categories.packaging",
      value: "packaging",
      units: [
        { labelKey: "units.PK", value: "PK" },
        { labelKey: "units.CS", value: "CS" },
        { labelKey: "units.CTN", value: "CTN" },
        { labelKey: "units.BDL", value: "BDL" },
        { labelKey: "units.PLT", value: "PLT" }
      ]
    },
    {
      labelKey: "categories.weight_based",
      value: "weight_based",
      units: [
        { labelKey: "units.KG", value: "KG" },
        { labelKey: "units.G", value: "G" },
        { labelKey: "units.LB", value: "LB" },
        { labelKey: "units.OZ", value: "OZ" },
        { labelKey: "units.TN", value: "TN" }
      ]
    },
    {
      labelKey: "categories.volume_based",
      value: "volume_based",
      units: [
        { labelKey: "units.L", value: "L" },
        { labelKey: "units.mL", value: "mL" },
        { labelKey: "units.GAL", value: "GAL" },
        { labelKey: "units.QT", value: "QT" }
      ]
    },
    {
      labelKey: "categories.length_based",
      value: "length_based",
      units: [
        { labelKey: "units.M", value: "M" },
        { labelKey: "units.CM", value: "CM" },
        { labelKey: "units.MM", value: "MM" },
        { labelKey: "units.FT", value: "FT" },
        { labelKey: "units.IN", value: "IN" }
      ]
    },
    {
      labelKey: "categories.area_volume",
      value: "area_volume",
      units: [
        { labelKey: "units.m²", value: "m²" },
        { labelKey: "units.ft²", value: "ft²" },
        { labelKey: "units.m³", value: "m³" },
        { labelKey: "units.ft³", value: "ft³" }
      ]
    },
    {
      labelKey: "categories.specialized",
      value: "specialized",
      units: [
        { labelKey: "units.BTL", value: "BTL" },
        { labelKey: "units.TUBE", value: "TUBE" },
        { labelKey: "units.ROLL", value: "ROLL" },
        { labelKey: "units.SHEET", value: "SHEET" },
        { labelKey: "units.BX", value: "BX" }
      ]
    },
    {
      labelKey: "categories.industry_specific",
      value: "industry_specific",
      units: [
        { labelKey: "units.bbl", value: "bbl" },
        { labelKey: "units.MT", value: "MT" },
        { labelKey: "units.REEL", value: "REEL" },
        { labelKey: "units.PKT", value: "PKT" },
        { labelKey: "units.SHT", value: "SHT" }
      ]
    },
    {
      labelKey: "categories.hybrid",
      value: "hybrid",
      units: [
        { labelKey: "units.kg/pack", value: "kg/pack" },
        { labelKey: "units.m/pack", value: "m/pack" }
      ]
    },
    {
      labelKey: "categories.electronic",
      value: "electronic",
      units: [
        { labelKey: "units.PK", value: "PK" },
        { labelKey: "units.BOX", value: "BOX" },
        { labelKey: "units.SET", value: "SET" }
      ]
    },
    {
      labelKey: "categories.packaging_dimensions",
      value: "packaging_dimensions",
      units: [
        { labelKey: "units.BTL", value: "BTL" },
        { labelKey: "units.CN", value: "CN" }
      ]
    },
    {
      labelKey: "categories.miscellaneous",
      value: "miscellaneous",
      units: [
        { labelKey: "units.BDL", value: "BDL" },
        { labelKey: "units.CRT", value: "CRT" },
        { labelKey: "units.BX", value: "BX" }
      ]
    }
  ];
  