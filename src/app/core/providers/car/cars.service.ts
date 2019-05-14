import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Subject } from "rxjs";
import { map } from "rxjs/operators";
import { Router } from "@angular/router";
import { environment } from './../../../../environments/environment';
import { Car } from "../../models/car.model";



const BACKEND_URL = environment.apiUrl + "/cars/";

@Injectable({ providedIn: "root" })
export class CarsService {
  private cars: Car[] = [];
  private carsUpdated = new Subject<{ cars: Car[]; carCount: number }>();

  constructor(private http: HttpClient, private router: Router) {}

  getCars(carsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${carsPerPage}&page=${currentPage}`;
    this.http
      .get<{ message: string; cars: any; maxCars: number }>(
        BACKEND_URL + queryParams
      )
      .pipe(
        map(carData => {
          return {
            cars: carData.cars.map(car => {
              return {
                name: car.name,
                make: car.make,
                model: car.model,
                id: car._id,
                imagePath: car.imagePath,
                creator: car.creator
              };
            }),
            maxCars: carData.maxCars
          };
        })
      )
      .subscribe(transformedCarData => {
        this.cars = transformedCarData.cars;
        this.carsUpdated.next({
          cars: [...this.cars],
          carCount: transformedCarData.maxCars
        });
      });
  }

  getCarUpdateListener() {
    return this.carsUpdated.asObservable();
  }

  getCar(id: string) {
    return this.http.get<{
      _id: string;
      name: string;
      make: string;
      model: string;
      imagePath: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addCar(name: string, make: string, model: string, image: File) {
    const carData = new FormData();
    carData.append("name", name);
    carData.append("make", make);
    carData.append("model", model);
    carData.append("image", image, name);
    this.http
      .post<{ message: string; car: Car }>(
        BACKEND_URL,
        carData
      )
      .subscribe(responseData => {
        this.router.navigate(["/"]);
      });
  }

  updateCar(id: string, name: string, make: string, model: string, image: File | string) {
    let carData: Car | FormData;
    if (typeof image === "object") {
      carData = new FormData();
      carData.append("id", id);
      carData.append("name", name);
      carData.append("make", make);
      carData.append("model", model);
      carData.append("image", image, name);
    } else {
      carData = {
        id: id,
        name: name,
        make: make,
        model: model,
        imagePath: image,
        creator: null
      };
    }
    this.http
      .put(BACKEND_URL + id, carData)
      .subscribe(response => {
        this.router.navigate(["/"]);
      });
  }

  deleteCar(carId: string) {
    return this.http.delete(BACKEND_URL + carId);
  }
}
