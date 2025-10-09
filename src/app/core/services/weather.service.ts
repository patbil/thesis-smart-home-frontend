import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class WeatherService {
  constructor(private readonly httpClient: HttpClient) {}

  getWeather(): Observable<any> {
    return this.httpClient.get(
      "https://api.openweathermap.org/data/2.5/weather?zip=26-505,PL&appid=fea4f84b428b0b77845c5d7d500b6b78&units=metric"
    );
  }
}
