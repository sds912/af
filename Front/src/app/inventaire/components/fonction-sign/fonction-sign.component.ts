import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';


@Component({
  selector: 'app-fonction-sign',
  templateUrl: './fonction-sign.component.html',
  styleUrls: ['./fonction-sign.component.sass']
})
export class FonctionSignComponent implements OnInit {

  fonctionIns = '';


  constructor(
    public dialogRef: MatDialogRef<FonctionSignComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
  }

  save() {
    this.dialogRef.close("its was close");
  }
}
