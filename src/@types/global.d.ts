export interface WeatherData {
  dt: number;
  dt_txt: string;
  main: {
    temp: number;
    temp_min: number;
    temp_max: number;
  };
  weather: {
    main: string;
    description: string;
  }[];
}

export interface LocationData {
  results: {
    region: {
      area1?: { name: string };
      area2?: { name: string };
      area3?: { name: string };
    };
  }[];
}

export interface TempData {
  list: {
    dt: number | undefined;
    main: {
      temp: number;
    };
    weather: {
      main: string;
      description: string;
    }[];
  }[];
}

export interface Document {
  documents: {
    address_name: string;
    road_address: {
      building_name: string;
      zone_no: string;
      x?: string;
      y?: string;
    };
    x?: string;
    y?: string;
  }[];
}
