import { HttpParams } from "@angular/common/http";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import * as Highcharts from "highcharts";
import { ReportsService } from "src/app/core/services/reports.service";
import {
  humidityOptions,
  tempOptions,
} from "../../../core/config/charts.config";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-reports",
  templateUrl: "./reports.component.html",
  styleUrls: ["./reports.component.css"],
})
export class ReportsComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  TempCharts: typeof Highcharts = Highcharts;
  HumidityCharts: typeof Highcharts = Highcharts;
  tempRef: any;
  humidityRef: any;
  tempOptions = tempOptions;
  humidityOptions = humidityOptions;
  date: any;
  tempCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.tempRef = chart;
  };
  humidityCallback: Highcharts.ChartCallbackFunction = (chart) => {
    this.humidityRef = chart;
  };

  constructor(private readonly reportService: ReportsService) {}

  ngOnInit(): void {
    this.date = new FormControl(new Date());

    // Solving the problem of loading a graph in incomplete size
    setTimeout(() => {
      window.dispatchEvent(new Event("resize"));
    }, 300);

    this.getData(false);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onDateChange() {
    this.getData(true);
  }

  private getData(datepicker: boolean) {
    const today = new Date(); // today

    let params = new HttpParams({
      fromObject: {
        start: this.date.value.setHours(0, 0, 0, 0),
        end: Date.now(),
      },
    });

    if (
      datepicker &&
      today.setHours(0, 0, 0, 0) !== this.date.value.setHours(0, 0, 0, 0)
    ) {
      params = new HttpParams({
        fromObject: {
          start: this.date.value.setHours(0, 0, 0, 0),
          end: this.date.value.setHours(23, 59, 59, 0),
        },
      });
    }

    this.reportService
      .getHumidityStats(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.humidityRef.series[0].update({ data: res.data });
        this.humidityRef.xAxis[0].setCategories(res.xAxis);
        this.humidityRef.redraw();
      });

    this.reportService
      .getTemperatureStats(params)
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.tempRef.series[0].update({ data: res.data });
        this.tempRef.xAxis[0].setCategories(res.xAxis);
        this.tempRef.redraw();
      });
  }
}
