import {Directive, ElementRef, HostListener} from '@angular/core';
import {FormService} from "../../../form.service";

@Directive({
  selector: 'input[phone]'
})
export class PhoneDirective {

  constructor(private _inputEl: ElementRef, public form:FormService) {}
  @HostListener('input', ['$event'])
  onInput(event: any) {
    let cleanInput = this._inputEl.nativeElement.value.replace(/[^0-9 ]/g, '');
    let input = cleanInput;

    if (cleanInput.length == 2 || cleanInput.length == 3){
      input = cleanInput.slice(0,2) + " " + cleanInput.slice(2)
    }else if ((cleanInput.length == 5 || cleanInput.length == 6) && cleanInput.slice(0,2) == "41"){
      input = cleanInput.slice(0,5)+" "+cleanInput.slice(5)
    }else if ((cleanInput.length == 9 || cleanInput.length == 10) && cleanInput.slice(0,2) == "41"){
      input = cleanInput.slice(0,9)+" "+cleanInput.slice(9)
    }else if ((cleanInput.length == 12 || cleanInput.length == 13) && cleanInput.slice(0,2) == "41"){
      input = cleanInput.slice(0,12)+" "+cleanInput.slice(12)
    }

    //If Backspace
    if(event.inputType == 'deleteContentBackward'){
      switch (cleanInput.length){
        case 2:
        case 3:
        case 5:
        case 6:
        case 9:
        case 10:
        case 12:
        case 13:
          input = cleanInput.slice(0, (cleanInput.length-1))
      }
    }

    //Set both to avoid FormGroup being outdated
    this.form.personalData.value.phoneNumber = input;
    this._inputEl.nativeElement.value = input;
  }
}
