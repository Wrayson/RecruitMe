import {Directive, ElementRef, HostListener} from '@angular/core';
import {FormService} from "../../../form.service";

@Directive({
  selector: 'input[ahv]'
})
export class AhvDirective {
  constructor(private _inputEl: ElementRef, public form:FormService) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    //TO-DO Re-Do this in the future, too many "small bugs"
    //With a "format"-handler, which always cleans the input and formats it in the end?
    let cleanInput = this._inputEl.nativeElement.value.replace(/[^0-9.]/g, '');
    let input = cleanInput;

    if (cleanInput.length == 4 || cleanInput.length == 5){
      input = cleanInput.slice(0,4) + "." + cleanInput.slice(4)
    }else if (cleanInput.length == 9 || cleanInput.length == 10){
      input = cleanInput.slice(0,9)+"."+cleanInput.slice(9)
    }

    //If Backspace
    if(event.inputType == 'deleteContentBackward'){
      switch (cleanInput.length){
        case 4:
        case 5:
        case 9:
        case 10:
          input = cleanInput.slice(0, (cleanInput.length-1))
      }
    }

    if(event.inputType == 'insertText'){
      //automatically calculate the "prüfziffer"
      if (cleanInput.length == 11 || cleanInput.length == 10){
        let ahv = "756"+cleanInput.replace(/[^0-9]/g, '')
        let result = 0;
        let i = 1;
        for (let counter = ahv.length-1; counter >=0; counter--){
          result = result + parseInt(ahv.charAt(counter)) * (1+(2*(i % 2)));
          i++;
        }
        input = input + ((10 - (result % 10)) % 10)
      }
    }

    //Set both to avoid FormGroup being outdated
    this.form.personalData.value.ahvNumber = input;
    this._inputEl.nativeElement.value = input;
  }

}
