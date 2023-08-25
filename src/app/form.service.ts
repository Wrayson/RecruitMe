import {Injectable, ViewChild, ViewContainerRef} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";

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
    gender: ['', Validators.required],
    birthDate: ['', [Validators.required, Validators.min(16)]],
    nationality: ['', Validators.required],
    permit: [''],
    phone: ['', [Validators.required, Validators.min(10)]],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')]],
    ssNumber: ['', Validators.required],
    civil: ['', Validators.required],
    children: [,[Validators.required, Validators.max(10)]],
    address: this.fb.group({
      street: ['', Validators.required],
      number: [,[Validators.required, Validators.min(1)]],
      zip: [, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
    })
  });

  familyData = this.fb.group({
    partnerFN: ['', Validators.required],
    partnerLN: ['', Validators.required],
    partnerBD: ['', Validators.required],
    child1FN: ['', Validators.required],
    child1LN: ['', Validators.required],
    child1BD: ['', Validators.required],
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

  recruitingData = this.fb.group({
    ownBills: ['', Validators.required],
    foreignBills: [''],
    VAT: [''],
    wage: [''],
    provision: [''],
  });

  public getFamilyNeeded(){
    // @ts-ignore
    if (this.personalData.value.civil=="married" || +this.personalData.value.children >= 1){
      return true;
    }else{
      return false;
    }
  }

  public getContract(){
    //Falls Kandidat eigene Rechnung stellt
    if (this.recruitingData.value.ownBills == "1"){
      //Falls die Rechnung aus dem Ausland gestellt wird
      if(this.recruitingData.value.foreignBills == "1"){
        return "RRAG"
      }
      //Falls Rechnung im Inland gestellt wird
      else{
        //Falls Kandidat Mehrwertsteuerpflichtig ist
        if(this.recruitingData.value.VAT == "1"){
          return "RRAG"
        }
        //Falls Kandidat nicht Mehrwertsteuerpflichtig ist
        else{
          return "RRSAG"
        }
      }
    }
    //Falls Kandidat keine eigene Rechnung stellt
    else{
      //Falls dem Kandidat ein Lohn gezahlt wird
      if(this.recruitingData.value.wage == "1"){
        return "RRSAG"
      }
      //Falls dem Kandidat kein Lohn gezahlt wird
      else{
        //Falls Provision erhalten wird
        if (this.recruitingData.value.wage == "1"){
          return "RRSAG"
        }
        //Falls keine Provision erhalten wird
        else{
          return "noMatch"
        }
      }
    }
  }

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
