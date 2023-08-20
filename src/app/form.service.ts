import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import jsPDF from "jspdf";
import {VertragAComponent} from "./comp/assets/vertrag-a/vertrag-a.component";
import {ActivatedRoute, Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  testing = "doesnt work";

  public assignedContract: any |undefined;
  @ViewChild('dynamicContract', {
    read: ViewContainerRef
  }) viewContainerRef: ViewContainerRef
    | undefined



  //Each step has their own FormGroup.
  //This is needed because of stepControl.
  personalData = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')]],
    gender: ['', Validators.required],
    birthDate: ['', [Validators.required, Validators.min(16)]],
    nationality: ['', Validators.required],
    permit: [''],
    phone: ['', Validators.required],
    address: this.fb.group({
      street: ['', Validators.required],
      number: ['', Validators.required],
      zip: ['', [Validators.required, Validators.minLength(4)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
    })
  });

  workData = this.fb.group({
    company: ['', Validators.required],
    jobDesc: ['', Validators.required],
    salary: ['', Validators.required],
    workload: ['', Validators.required],
    probationPeriod: ['', Validators.required],
    noticePeriod: ['', Validators.required],
    jobType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
  });

  public getWordsByGender(){
    switch (this.personalData.value.gender){
      case "male": {return ["Herr","welcher"]}
      case "female":{return ["Frau","welche"]}
      default: {return ["Frau/Herr","welche/welcher"]}
    }
  }

  public getFormattedBirthdate(){
    let sBD = this.personalData.value.birthDate?.split("-", 3);
    // @ts-ignore
    return sBD[2]+"."+sBD[1]+"."+sBD[0]
  }

  public getSalaryByWorkLoad(){
    // @ts-ignore
    return Math.round((+this.workData.value.salary * (+this.workData.value.workload/100))*20)/20;
  }

  public getWageBySalary(){
    // @ts-ignore
    return Math.round((this.getSalaryByWorkLoad()/12)*20)/20;
  }

  public getJobType(){
    switch (this.workData.value.jobType){
      case "perm": {return "feste"}
      case "temp":{return "temporäre"}
      default: {return "undefinierte"}
    }
  }
  onSubmit(){
    //On Form Submit
    //Decide which contract to use
  }

  constructor(private fb:FormBuilder) { }
}
