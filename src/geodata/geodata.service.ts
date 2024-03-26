import { Injectable } from '@nestjs/common';
import { Client } from '@googlemaps/google-maps-services-js';

import { Coordinates } from './interfaces/coordinates.interface';

@Injectable()
export class GeodataService {
  async findCoordinates(address: string): Promise<Coordinates | null> {
    const client = new Client({});

    try {
      const result = await client.geocode({
        params: {
          key: process.env.GOOGLE_CLOUD_API_KEY,
          address,
        },
      });
      const geocodeResult = result.data.results[0];
      if (!geocodeResult) return null;

      const geolocation = geocodeResult.geometry.location;

      return {
        latitude: geolocation.lat,
        longitude: geolocation.lng,
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
