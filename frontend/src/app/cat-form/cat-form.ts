import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Cat } from '../services/cat';

@Component({
  selector: 'app-cat-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  templateUrl: './cat-form.html',
  styleUrls: ['./cat-form.css']
})
export class CatFormComponent {
  name: string;
  age: number;
  breed: string;
  fur_length: string;
  furOptions = [
    { value: 'short', label: 'Короткая' },
    { value: 'long', label: 'Длинная' },
    { value: 'hairless', label: 'Без шерсти' }
  ];

  constructor(
    public dialogRef: MatDialogRef<CatFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Cat
  ) {
    this.name = data.name || '';
    this.age = data.age || 0;
    this.breed = data.breed || '';
    this.fur_length = data.fur_length || 'short';
  }

  onSave(): void {
    if (!this.isFormValid()) return;
    const cat: Cat = {
      name: this.name,
      age: this.age,
      breed: this.breed,
      fur_length: this.fur_length
    };
    this.dialogRef.close(cat);
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  isFormValid(): boolean {
    const nameOk = !!this.name && this.name.trim().length > 0;
    const ageOk = this.age > 0;
    const breedOk = !!this.breed && /^[A-Za-zА-Яа-яЁё\s]+$/.test(this.breed);
    return nameOk && ageOk && breedOk;
  }
}
