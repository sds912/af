import { Component, ElementRef, ViewChild, OnInit  } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import {
  MatAutocompleteSelectedEvent,
  MatAutocomplete
} from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

export interface ChipColor {
  name: string;
  color: string;
}

export interface Fruit {
  name: string;
}
@Component({
  selector: 'app-zonage',
  templateUrl: './zonage.component.html',
  styleUrls: ['./zonage.component.sass']
})
export class ZonageComponent implements OnInit {
  visible = true;
  selectable = true;
  removable = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];
  fruitCtrl = new FormControl();
  filteredFruits: Observable<string[]>;
  fruits: string[] = ['Bureau 1','Bureau 2','Bureau 3','Bureau 4','Bureau 5','Bureau 6','Bureau 8','Bureau 9','Bureau X','Bureau Y','Bureau Z'];
  tab=['Dakar','Exemple 2','Exemple 3','Exemple 4','Exemple 5']
  tab2=['Zone industrielle','Zone des Niayes','Zone X','Zone Y','Zone Z']
  anelOpenState = false;
  step = 0;

  @ViewChild('fruitInput', { static: true }) fruitInput: ElementRef<HTMLInputElement>;
  //@ViewChild('auto', { static: true }) matAutocomplete: MatAutocomplete;

  constructor() {
  }
  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;

    // Add our fruit
    if ((value || '').trim()) {
      this.fruits.push(value.trim());
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }

    this.fruitCtrl.setValue(null);
  }

  remove(fruit: string): void {
    const index = this.fruits.indexOf(fruit);

    if (index >= 0) {
      this.fruits.splice(index, 1);
    }
  }
  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }
}
