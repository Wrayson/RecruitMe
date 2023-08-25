import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {DatabaseService} from "./database.service";

@Injectable({
  providedIn: 'root'
})
export class FormService {

  familyNeeded = false;

  //Each step has their own FormGroup.
  //This is needed because of stepControl.
  personalData = this.fb.group({
    firstName: ['', Validators.required],
    lastName: ['', Validators.required],
    gender: ['', Validators.required],
    birthDate: ['', [Validators.required, Validators.min(16)]],
    nationality: ['', Validators.required],
    permit: [''],
    phoneNumber: ['', [Validators.required, Validators.min(10)]],
    email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')]],
    ahvNumber: ['', Validators.required],
    civilStatus: ['', Validators.required],
    children: [,[Validators.required, Validators.max(10)]],
    address: this.fb.group({
      street: ['', Validators.required],
      number: [,[Validators.required, Validators.min(1)]],
      zip: [, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
    })
  });

  internData = this.fb.group({
    companyName: ['', Validators.required],
    jobDesc: ['', Validators.required],
    salary: ['', Validators.required],
    workload: ['', Validators.required],
    probationPeriod: ['', Validators.required],
    noticePeriod: ['', Validators.required],
    jobType: ['', Validators.required],
    startDate: ['', Validators.required],
    endDate: [''],
  });

  externData = this.fb.group({
    cheNum: ['', Validators.required],
    companyName: ['', Validators.required],
    companyType: ['', Validators.required],
    address: this.fb.group({
      street: ['', Validators.required],
      number: [,[Validators.required, Validators.min(1)]],
      zip: [, [Validators.required, Validators.minLength(4), Validators.maxLength(6)]],
      city: ['', Validators.required],
      country: ['', Validators.required],
    }),
    contact: this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: [, [Validators.required, Validators.min(10)]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$')]],
    })
  });


  recruitingData = this.fb.group({
    ownBills: ['', Validators.required],
    foreignBills: [''],
    VAT: [''],
    wage: [''],
    provision: [''],
  });

  familyData = this.fb.group({});

  public resetFamily(){
    this.familyData = this.fb.group({});
  }

  public getFamilyNeeded() {
    // @ts-ignore personalDate Value not set
    if (this.personalData.value.civilStatus == "married" || +this.personalData.value.children >= 1) {
      if (this.personalData.value.civilStatus == "married" && !this.familyData.contains('partner')) {
        this.familyData.addControl('partner', this.fb.group({
          firstName: [''],
          lastName: [''],
          birthDate: [''],
        }))
        this.familyNeeded = true;
      }
      // @ts-ignore personalDate Value not set
      if (+this.personalData.value.children >= 1 && !this.familyData.contains('children')) {
        const children: any = new FormGroup([])
        // @ts-ignore personalDate Value not set
        for (let i = 0; i < +this.personalData.value.children; i++) {
          children.addControl('child'+(i + 1), this.fb.group({
            firstName: [''],
            lastName: [''],
            birthDate: [''],
          }))
        }
        this.familyData.addControl('children', children)
        this.familyNeeded = true
      }
      return this.familyNeeded;
    } else {
      this.familyNeeded = false
      return this.familyNeeded;
    }
  }

  public getRecruitmentType(){
    // @ts-ignore
    if (+this.recruitingData.value.ownBills == 1){
      this.recruitingData.get('wage')?.reset()
      this.recruitingData.controls['wage'].clearValidators()
      this.recruitingData.get('provision')?.reset()
      this.recruitingData.controls['provision'].clearValidators()
      this.recruitingData.controls['foreignBills'].setValidators(Validators.required)
      // @ts-ignore
      if (+this.recruitingData.value.foreignBills == 1){
        this.internData.reset()
        return ['extern', 'RRAG']
      }
      else{
        this.recruitingData.controls['VAT'].setValidators(Validators.required)
        // @ts-ignore
        if (+this.recruitingData.value.VAT == 1){
          this.internData.reset()
          return ['extern', 'RRAG']
        }else{
          this.internData.reset()
          return ['extern', 'RRSAG']
        }
      }
    }else{
      this.recruitingData.get('foreignBills')?.reset()
      this.recruitingData.controls['foreignBills'].clearValidators()
      this.recruitingData.get('VAT')?.reset()
      this.recruitingData.controls['VAT'].clearValidators()
      this.recruitingData.controls['wage'].setValidators(Validators.required)
      // @ts-ignore
      if (+this.recruitingData.value.wage == 1){
        this.externData.reset()
        return ['intern', 'RRSAG']
      }else{
        this.recruitingData.controls['provision'].setValidators(Validators.required)
        // @ts-ignore
        if (+this.recruitingData.value.provision == 1){
          this.externData.reset()
          return ['intern', 'RRSAG']
        }else{
          this.externData.reset()
          return ['none', 'none']
        }
      }
    }
  }

  public getNumChildren() {
    // @ts-ignore
    return Array(+this.personalData.value.children).fill(0).map((x, i) => i);
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
    return Math.round((+this.internData.value.salary * (+this.internData.value.workload/100))*20)/20;
  }

  public getWageBySalary(){
    // @ts-ignore
    return Math.round((this.getSalaryByWorkLoad()/12)*20)/20;
  }

  constructor(private fb:FormBuilder) {
  }
}
