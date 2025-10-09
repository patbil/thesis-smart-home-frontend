import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from "@angular/core";
import { WeatherService } from "src/app/core/services/weather.service";
import { DashboardService } from "src/app/core/services/dashboard.service";
import { config } from "../../../core/config/gauge.config";
import { MatSlideToggle } from "@angular/material/slide-toggle";
import { ProfileServices } from "src/app/auth/services/profile.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"],
})
export class DashboardComponent implements OnInit, OnDestroy {
  private readonly destroy$ = new Subject<void>();

  @ViewChildren("toggleIn") toggleIn!: QueryList<MatSlideToggle>;
  @ViewChildren("toggleOut") toogleOut!: QueryList<MatSlideToggle>;

  temp = 0;
  hum = 0;
  weather: any;
  config = config;
  lightingOut: any;
  lightingIn: any;
  servos: any;
  state = {
    allIn: false,
    allOut: false,
    sensor: false,
    detector: false,
  };
  username = "";

  constructor(
    private readonly dashboardService: DashboardService,
    private readonly weatherService: WeatherService,
    private readonly profileService: ProfileServices
  ) {}

  ngOnInit(): void {
    this.initialize();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changeLightState(state: any, name: string) {
    this.state.allIn = this.toggleIn.toArray().every((x: any) => x.checked);
    this.state.allOut = this.toogleOut.toArray().every((x: any) => x.checked);
    this.dashboardService.updateLighting(name, state).subscribe();
  }

  changeAllIn(state: boolean) {
    this.state.allIn = !this.state.allIn;
    this.toggleIn.toArray().forEach((x: any) => (x.checked = state));
    this.dashboardService.updateAllIn(state).subscribe();
  }

  changeAllOut(state: boolean) {
    this.state.allOut = !this.state.allOut;
    this.toogleOut.toArray().forEach((x: any) => (x.checked = state));
    this.dashboardService.updateAllOut(state).subscribe();
  }

  changeSensorState(state: boolean) {
    this.state.sensor = !this.state.sensor;
    this.dashboardService.updateSensor(state).subscribe();
  }

  changeDetectorState(state: boolean) {
    this.state.detector = !this.state.detector;
    this.dashboardService.updateDetector(state).subscribe();
  }

  changeServoState(state: boolean, data: any) {
    data.state = Number(state);
    this.dashboardService.updateServo(data).subscribe();
  }

  private initialize() {
    this.dashboardService
      .getTemperature()
      .pipe(takeUntil(this.destroy$))
      .subscribe((temp) => (this.temp = temp));

    this.dashboardService
      .getHumidity()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hum) => (this.hum = hum));

    this.dashboardService
      .getLigthing()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.lightingIn = res.filter((x: any) => x.location === "in");
        this.lightingOut = res.filter((x: any) => x.location === "out");
        this.state.allIn = this.lightingIn.every((x: any) => x.state);
        this.state.allOut = this.lightingOut.every((x: any) => x.state);
      });

    this.dashboardService
      .getServoState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.servos = res));

    this.dashboardService
      .getAlarmState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.state.detector = Boolean(res.at(0).state)));

    this.dashboardService
      .getSensorState()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => (this.state.sensor = Boolean(res.at(0).state)));

    this.weatherService
      .getWeather()
      .pipe(takeUntil(this.destroy$))
      .subscribe((w) => (this.weather = w));

    this.profileService.username$
      .pipe(takeUntil(this.destroy$))
      .subscribe((x) => (this.username = x));
  }
}
