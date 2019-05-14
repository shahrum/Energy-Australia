import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormBuilder, ReactiveFormsModule, FormsModule, NgForm } from '@angular/forms';
import { LoginComponent } from './login.component';
import { AuthService } from 'src/app/core/providers';


describe('LoginComponent', () => {

  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService;

  beforeEach(async(() => {

    mockAuthService = jasmine.createSpyObj(['updateUser', 'getUserByUserId', 'getPaginatedUserTableData']);

    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ ReactiveFormsModule, FormsModule, BrowserAnimationsModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        FormBuilder,
        { provide: AuthService, useValue: mockAuthService },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('should initialise the component', () => {
    mockAuthService.getAuthStatusListener.and.returnValue(of(false));

    fixture.detectChanges();
    component.ngOnInit();

    expect(component.isLoading).toBeFalsy();
  });

  it('should call the login method', () => {
    mockAuthService.login.and.returnValue(null);
    let form: NgForm = fixture.debugElement.children[0].injector.get(NgForm);
    let emailControl = form.control.get('email');
    let passwordControl = form.control.get('password');
    emailControl.setValue('Shha268@gmail.com');
    passwordControl.setValue('123456');
    emailControl.updateValueAndValidity();
    passwordControl.updateValueAndValidity();

    fixture.detectChanges();

    component.onLogin(form);

    expect(form.invalid).toBe(false);
  });

});
