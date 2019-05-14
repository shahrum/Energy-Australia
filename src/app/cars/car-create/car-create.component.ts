import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, ParamMap } from "@angular/router";
import { Subscription } from "rxjs";
import { AuthService, CarsService } from "src/app/core/providers";
import { Car } from './../../core/models/car.model';

import { mimeType } from "./mime-type.validator";

@Component({
  selector: "app-car-create",
  templateUrl: "./car-create.component.html",
  styleUrls: ["./car-create.component.css"]
})
export class CarCreateComponent implements OnInit, OnDestroy {
  enteredTitle = "";
  enteredContent = "";
  car: Car;
  isLoading = false;
  form: FormGroup;
  imagePreview: string;
  private mode = "create";
  private carId: string;
  private authStatusSub: Subscription;

  constructor(
    public carsService: CarsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(authStatus => {
        this.isLoading = false;
      });
    this.form = new FormGroup({
      name: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      make: new FormControl(null, { validators: [Validators.required] }),
      model: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("carId")) {
        this.mode = "edit";
        this.carId = paramMap.get("carId");
        this.isLoading = true;
        this.carsService.getCar(this.carId).subscribe(carData => {
          this.isLoading = false;
          this.car = {
            id: carData._id,
            name: carData.name,
            make: carData.make,
            model: carData.model,
            imagePath: carData.imagePath,
            creator: carData.creator
          };
          this.form.setValue({
            name: this.car.name,
            make: this.car.make,
            model: this.car.model,
            image: this.car.imagePath
          });
        });
      } else {
        this.mode = "create";
        this.carId = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get("image").updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as any;
    };
    reader.readAsDataURL(file);
  }

  onSaveCar() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === "create") {
      this.carsService.addCar(
        this.form.value.name,
        this.form.value.make,
        this.form.value.model,
        this.form.value.image
      );
    } else {
      this.carsService.updateCar(
        this.carId,
        this.form.value.name,
        this.form.value.make,
        this.form.value.model,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
