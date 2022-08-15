import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
} from '@angular/forms';

@Component({
  selector: 'app-customer-filter',
  templateUrl: './customer-filter.component.html',
  styleUrls: ['./customer-filter.component.css'],
})
export class CustomerFilterComponent implements OnInit {
  tabType: string = 'string';
  @ViewChild('selectBtn') selectBtn: ElementRef<HTMLButtonElement> | undefined;

  deleteStepFormRow(index: number) {
    this.stepForm.removeAt(index);
  }

  eventDropdown: string[] = [
    'session_start',
    'session_end',
    'page_visit',
    'first_session',
    'consent',
    'banner',
    'purchase',
  ];

  actionDropdown: string[] = [
    'browser',
    'device',
    'location',
    'os',
    'path',
    'referrer',
    'timestamp',
    'index',
  ];

  conditionalMenus = [
    {
      type: 'string',
      options: ['equals', 'does not equal', 'contains', 'does not contains'],
    },
    {
      type: 'number',
      options: ['equal to', 'in-between', 'less than', 'greater than'],
    },
  ];

  setStringTab() {
    this.tabType = 'string';
  }

  setNumberTab() {
    this.tabType = 'number';
  }

  customerFilterForm: FormGroup = this.fb.group({
    stepForm: this.fb.array([]),
  });

  get stepForm() {
    return this.customerFilterForm.get('stepForm') as FormArray;
  }

  actionsForm(stepForm: AbstractControl) {
    return stepForm.get('actionsForm') as FormArray;
  }

  actionsFormControls(stepForm: AbstractControl) {
    return this.actionsForm(stepForm).controls;
  }

  get createActionsGroupForm() {
    const formGroup = this.fb.group({
      actionFilter: this.fb.control(''),
      eventConditions: this.fb.control('equals'),
      userInputVal: this.fb.control(''),
    });
    return formGroup;
  }

  addNewStepForm() {
    const stepFormGroup: FormGroup = this.fb.group({
      stepName: this.fb.control(''),
      actionsForm: this.fb.array([]),
    });
    this.stepForm.push(stepFormGroup);
  }

  resetCustomerFilterForm() {
    this.stepForm.clear();
    this.addNewStepForm();
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.addNewStepForm();
  }

  addEventAttribute(event: MouseEvent, stepForm: AbstractControl) {
    event.preventDefault();
    this.actionsForm(stepForm).push(this.createActionsGroupForm);
  }

  getCustomerFilterFormValue() {
    console.log(this.customerFilterForm.value);
  }

  refineForm(stepForm: AbstractControl) {
    this.actionsForm(stepForm).push(this.createActionsGroupForm);
  }

  deleteRow(stepForm: AbstractControl, index: number) {
    this.actionsForm(stepForm).removeAt(index);
  }

  copyRow(index: number) {
    const copyFormValue = this.stepForm.at(index).value;
    console.log(copyFormValue);
    let actionsForm: FormArray = this.fb.array([]);
    copyFormValue.actionsForm.forEach((form: any) => {
      const formGroup = this.fb.group({
        actionFilter: this.fb.control(form.actionFilter),
        eventConditions: this.fb.control(form.eventConditions),
        userInputVal: this.fb.control(form.userInputVal),
      });
      actionsForm.push(formGroup);
    });
    const stepFormGroup: FormGroup = this.fb.group({
      stepName: this.fb.control(copyFormValue.stepName),
      actionsForm: actionsForm,
    });
    this.stepForm.push(stepFormGroup);
  }

  setEventConditionsFormControl(event: any, actionForm: AbstractControl) {
    this.selectBtn?.nativeElement.click();
    actionForm?.get('eventConditions')?.setValue(event.target.value);
  }
}
