import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private readonly url = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  getTemperature(): Observable<any> {
    return this.httpClient.get(this.url + `air/temperature`);
  }

  getHumidity(): Observable<any> {
    return this.httpClient.get(this.url + `air/humidity`);
  }

  getLigthing(): Observable<any> {
    return this.httpClient.get(this.url + `lighting/state`);
  }

  getAlarmState(): Observable<any> {
    return this.httpClient.get(this.url + `alarm/state`);
  }

  getSensorState(): Observable<any> {
    return this.httpClient.get(this.url + `light/state`);
  }

  getServoState() {
    return this.httpClient.get(this.url + `servo/state`);
  }

  updateDetector(state: boolean) {
    return this.httpClient.put(this.url + `alarm`, { enabled: state });
  }

  updateLighting(name: string, state: boolean) {
    return this.httpClient.put(this.url + `lighting`, {
      name: name,
      state: state,
    });
  }

  updateAllIn(state: boolean) {
    return this.httpClient.put(this.url + `lighting/inside`, {
      enabled: state,
    });
  }

  updateAllOut(state: boolean) {
    return this.httpClient.put(this.url + `lighting/outside`, {
      enabled: state,
    });
  }

  updateSensor(state: boolean) {
    return this.httpClient.put(this.url + `light`, { enabled: state });
  }

  updateServo(data: any) {
    return this.httpClient.put(this.url + "servo", data);
  }
}
