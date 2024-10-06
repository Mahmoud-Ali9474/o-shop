import { Observable, Subscription, take } from 'rxjs';
import { CategoryService } from './../../services/category.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Category } from 'src/app/models/category';
import { ProductService } from 'src/app/services/product.service';
import { Product } from 'src/app/models/product';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  categoryServiceSubscription!: Subscription;
  product: Product = {
    id: '',
    title: '',
    category: '',
    price: 0,
    imageUrl: ''
  };
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) { }
  ngOnDestroy(): void {
    this.categoryServiceSubscription.unsubscribe();
  }
  ngOnInit(): void {
    let id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService
        .get(id)
        .snapshotChanges()
        .pipe(take(1))
        .subscribe(action => {
          this.product = action.payload.data()!;
          this.product.id = action.payload.id;
        })
    }
    this.categoryServiceSubscription = this.categoryService
      .getAll()
      .snapshotChanges()
      .subscribe(actions => {
        //console.log(actions)
        this.categories = actions.map(a => {
          let data = a.payload.doc.data() as Category;
          // console.log(data);
          data.id = a.payload.doc.id;
          return data;
        })
      })
  }
  save(product: Product) {
    //console.log(product)
    if (this.product.id) {
      this.productService.update(this.product.id, product)
    } else {
      this.productService.create(product);
    }
    this.router.navigate(['admin/products'])
  }
  delete() {
    if (!confirm('Are you sure you want to delete this product?'))
      return;
    this.productService.delete(this.product.id);
    this.router.navigate(['admin/products'])
  }
}
