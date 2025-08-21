import { Injectable } from '@angular/core';
import { fetchWeatherApi } from 'openmeteo';

export interface CurrentWeather {
  temperature: number;
  windspeed: number;
  weathercode: number;
  humidity: number;
}


@Injectable({
  providedIn: 'root'
})
export class WeatherService {

  async getCoordinates(city: string): Promise<{ lat: number; lon: number; country: string } | null> {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${city}`;
    const res = await fetch(url);
    const data = await res.json();

    if (data && data.length > 0) {
      const displayName: string = data[0].display_name || '';
      const parts = displayName.split(',');
      const country = parts[parts.length - 1]?.trim() || '';

      return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
        country
      };
    }
    return null;
  }

  async getWeather(lat: number, lon: number): Promise<CurrentWeather | null> {
    const url = "https://api.open-meteo.com/v1/forecast";
    const params = {
  latitude: lat,
  longitude: lon,
  current: ["temperature_2m", "windspeed_10m", "weathercode", "relative_humidity_2m"]
};
    const responses = await fetchWeatherApi(url, params);
    const response = responses[0];
    const current = response.current();

    if (!current) return null;

    return {
      temperature: current.variables(0)?.value() ?? 0,
      windspeed: current.variables(1)?.value() ?? 0,
      weathercode: current.variables(2)?.value() ?? 0,
      humidity: current.variables(3)?.value() ?? 0
    };
  }
}
