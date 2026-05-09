import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CatService, Cat } from '../services/cat';
import { CatFormComponent } from '../cat-form/cat-form';

@Component({
  selector: 'app-cats',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule, MatDialogModule],
  templateUrl: './cats.html',
  styleUrls: ['./cats.css']
})
export class CatsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'age', 'breed', 'fur_length', 'actions'];
  cats: Cat[] = [];

  constructor(
    private catService: CatService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.catService.getAll().subscribe({
      next: (data) => {
        this.cats = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Ошибка загрузки котов:', err)
    });
  }

  deleteCat(id: number): void {
    if (confirm('Удалить этого кота?')) {
      this.catService.delete(id).subscribe({
        next: () => {
          this.cats = this.cats.filter(c => c.id !== id);
          this.cdr.detectChanges();
        },
        error: (err) => console.error('Ошибка удаления:', err)
      });
    }
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CatFormComponent, {
      width: '400px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.catService.create(result).subscribe({
          next: (newCat) => {
            this.cats = [...this.cats, newCat];
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Ошибка создания:', err)
        });
      }
    });
  }

  openEditDialog(cat: Cat): void {
    const dialogRef = this.dialog.open(CatFormComponent, {
      width: '400px',
      data: { ...cat }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && cat.id) {
        this.catService.update(cat.id, result).subscribe({
          next: (updatedCat) => {
            const index = this.cats.findIndex(c => c.id === updatedCat.id);
            if (index !== -1) {
              this.cats[index] = updatedCat;
              this.cats = [...this.cats];
            }
            this.cdr.detectChanges();
          },
          error: (err) => console.error('Ошибка обновления:', err)
        });
      }
    });
  }
}