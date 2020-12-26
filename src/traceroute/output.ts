export type Location = {
  name: string;
  lat: number;
  long: number;
};

export type Hop = {
  ip: string;
  domain?: string;
  unknown: boolean;
  location?: Location;
};

export type Hops = Hop[];
