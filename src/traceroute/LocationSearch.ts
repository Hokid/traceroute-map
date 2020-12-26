import axios from 'axios';
import { Location } from './output';

type GeoJSResult = {
  country: string;
  city?: string;
  region?: string;
  latitude: string;
  longitude: string;
};

export class LocationSearch {
  constructor(public target: string) {}

  async search(): Promise<Location | undefined> {
    const implResult = await axios.get<GeoJSResult>(
      `https://get.geojs.io/v1/ip/geo/${this.target}.json`
    );

    if (!implResult.data || implResult.data.latitude === 'nil') {
      return;
    }

    let name = implResult.data.country;

    if (implResult.data.region) {
      name += `, ${implResult.data.region}`;
    }

    if (implResult.data.city) {
      name += `, ${implResult.data.city}`;
    }

    return {
      name,
      lat: parseFloat(implResult.data.latitude),
      long: parseFloat(implResult.data.longitude),
    };
  }
}
