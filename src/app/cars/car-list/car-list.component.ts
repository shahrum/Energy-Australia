import { Component, OnInit, OnDestroy } from "@angular/core";
import { PageEvent } from "@angular/material";
import { Subscription } from "rxjs";
import { CarsService } from './../../core/providers/car/cars.service';
import { AuthService } from "src/app/core/providers";
import { Car } from './../../core/models/car.model';


@Component({
  selector: "app-car-list",
  templateUrl: "./car-list.component.html",
  styleUrls: ["./car-list.component.css"]
})
export class CarListComponent implements OnInit, OnDestroy {
  cars: Car[] = [];
  isLoading = false;
  totalCars = 0;
  carsPerPage = 2;
  currentPage = 1;
  pageSizeOptions = [1, 2, 5, 10];
  userIsAuthenticated = false;
  userId: string;
  private carsSub: Subscription;
  private authStatusSub: Subscription;

  constructor(
    public carsService: CarsService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.carsService.getCars(this.carsPerPage, this.currentPage);
    this.userId = this.authService.getUserId();
    this.carsSub = this.carsService
      .getCarUpdateListener()
      .subscribe((carData: { cars: Car[]; carCount: number }) => {
        this.isLoading = false;
        this.totalCars = carData.carCount;
        this.cars = carData.cars;
        this.cars = this.cars.sort((a, b) => {
          if (a.make < b.make)
            return -1;
          if (a.make > b.make)
            return 1;
          return 0;
        })
      });
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.carsPerPage = pageData.pageSize;
    this.carsService.getCars(this.carsPerPage, this.currentPage);
  }

  onDelete(carId: string) {
    this.isLoading = true;
    this.carsService.deleteCar(carId).subscribe(() => {
      this.carsService.getCars(this.carsPerPage, this.currentPage);
    }, () => {
      this.isLoading = false;
    });
  }

  ngOnDestroy() {
    this.carsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
