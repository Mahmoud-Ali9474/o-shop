import { Component, Input, OnInit } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from 'shared/models/category';
import { CategoryService } from 'shared/services/category.service';

@Component({
  selector: 'product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.css']
})
export class ProductFilterComponent implements OnInit {
  @Input('category') category!: string
  categories$!: Observable<Category[]>
  constructor(private categoryService: CategoryService) {
    this.categories$ = this.categoryService
      .getAll()
      .snapshotChanges()
      .pipe(map(actions => {
        return actions.map(d => {
          let data = d.payload.doc.data() as Category;
          data.id = d.payload.doc.id;
          return data;
        })
      }))
  }
  ngOnInit(): void {

  }
}
