import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { WeatherService } from '../service/weather';

@Component({
  selector: 'app-home',
  standalone: true,   // ⬅️ mark as standalone
  imports: [CommonModule, FormsModule], // ⬅️ NO BrowserModule here
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  city: string = '';
  weatherData: any = null;
  errorMessage: string = '';

  constructor(
    private weatherService: WeatherService,
    private cdr: ChangeDetectorRef
  ) {}

  async searchWeather() {
    this.errorMessage = '';
    this.weatherData = null;

    const trimmedCity = this.city.trim();
    if (!trimmedCity) {
      this.errorMessage = 'Please enter a city!';
      return;
    }

    try {
      const coords = await this.weatherService.getCoordinates(trimmedCity);
      if (!coords) {
        this.errorMessage = 'City not found!';
        return;
      }

      try {
        const current: any = await this.weatherService.getWeather(coords.lat, coords.lon);
        if (!current) {
          this.errorMessage = 'Error fetching weather data!';
          return;
        }

        this.weatherData = {
          location: {
            name: trimmedCity,
            country: coords.country ?? ''
          },
          current: {
            temp_c: Math.round(current.temperature),
            wind_kph: Math.round(current.windspeed),
            humidity: current.humidity,
            condition: {
              text: this.mapWeatherCode(current.weathercode),
              icon: this.getWeatherIcon(current.weathercode)
            }
          }
        };

        this.cdr.detectChanges(); // force UI update
      } catch {
        this.errorMessage = 'Error fetching weather data!';
      }
    } catch (error) {
      this.errorMessage = 'Error fetching coordinates!';
    }
  }

  private mapWeatherCode(code: number): string {
    const map: { [key: number]: string } = {
      0: "☀️ Clear sky",
      1: "🌤️ Mainly clear",
      2: "⛅ Partly cloudy",
      3: "☁️ Overcast",
      45: "🌫️ Fog",
      48: "🌫️ Rime fog",
      51: "🌦️ Light drizzle",
      61: "🌧️ Rain",
      71: "❄️ Snowfall",
      95: "⛈️ Thunderstorm"
    };
    return map[code] || `Weather code ${code}`;
  }

  private getWeatherIcon(code: number): string {
    const icons: { [key: number]: string } = {
      0: "https://cdn-icons-png.flaticon.com/512/869/869869.png",
      1: "https://cdn-icons-png.flaticon.com/512/1163/1163661.png",
      2: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
      3: "https://cdn-icons-png.flaticon.com/512/1163/1163624.png",
      45: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
      48: "https://cdn-icons-png.flaticon.com/512/4005/4005901.png",
      61: "https://cdn-icons-png.flaticon.com/512/1163/1163657.png",
      71: "https://cdn-icons-png.flaticon.com/512/1163/1163620.png",
      95: "https://cdn-icons-png.flaticon.com/512/1146/1146860.png"
    };
    return icons[code] || "";
  }
}
