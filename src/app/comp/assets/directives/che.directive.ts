import {Directive, ElementRef, HostListener} from '@angular/core';
import {FormService} from "../../../form.service";

@Directive({
  selector: 'input[che]'
})
export class CheDirective {

  constructor(private _inputEl: ElementRef, public form:FormService) {}

  @HostListener('input', ['$event'])
  onInput(event: any) {
    //TO-DO Re-Do this in the future, too many "small bugs"
    //With a "format"-handler, which always cleans the input and formats it in the end?
    let cleanInput = this._inputEl.nativeElement.value.replace(/[^0-9.]/g, '');
    let input = cleanInput;

    if (cleanInput.length == 3 || cleanInput.length == 4){
      input = cleanInput.slice(0,3) + "." + cleanInput.slice(3)
    }else if (cleanInput.length == 7 || cleanInput.length == 8){
      input = cleanInput.slice(0,7)+"."+cleanInput.slice(7)
    }

    //If Backspace
    if(event.inputType == 'deleteContentBackward'){
      switch (cleanInput.length){
        case 3:
        case 4:
        case 7:
        case 8:
          input = cleanInput.slice(0, (cleanInput.length-1))
      }
    }

    if (event.inputType == 'insertText' && cleanInput.length == 11){
      //SOAP Request
      // TO-DO
    }

    //Set both to avoid FormGroup being outdated
    this.form.externData.value.cheNum = input;
    this._inputEl.nativeElement.value = input;
  }
}
