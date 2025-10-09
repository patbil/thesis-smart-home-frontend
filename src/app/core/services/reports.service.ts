import { map } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class ReportsService {
  private readonly url = environment.baseUrl;

  constructor(private readonly httpClient: HttpClient) {}

  getHumidityStats(params: any) {
    return this.httpClient
      .get(this.url + `air/humidity/stats`, { params: params })
      .pipe(
        map((r) => {
          const items = <any[]>r;
          let res: any = {
            xAxis: [],
            data: [],
          };
          items.forEach((e) => {
            res.data.push(e.value);
            res.xAxis.push(
              new Date(e.timestamp)
                .toLocaleString("pl-PL")
                .replace(/(.*)\D\d+/, "$1")
            );
          });
          return res;
        })
      );
  }

  getTemperatureStats(params: any) {
    return this.httpClient
      .get(this.url + `air/temperature/stats`, { params: params })
      .pipe(
        map((r) => {
          const items = <any[]>r;
          let res: any = {
            xAxis: [],
            data: [],
          };
          items.forEach((e) => {
            res.data.push(e.value);
            res.xAxis.push(
              new Date(e.timestamp)
                .toLocaleString("pl-PL")
                .replace(/(.*)\D\d+/, "$1")
            );
          });
          return res;
        })
      );
  }
}
