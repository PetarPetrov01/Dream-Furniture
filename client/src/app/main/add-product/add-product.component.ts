import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  OnInit,
  inject,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ActivatedRoute, Router } from '@angular/router';

import {
  FormArray,
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { ApiService } from '../../shared/api.service';

import { Product } from '../../types/Product';
import { LoaderComponent } from '../../shared/loader/loader.component';

@Component({
  selector: 'app-add-product',
  imports: [
    MatSelectModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    LoaderComponent,
  ],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddProductComponent implements OnInit {
  private fb = inject(FormBuilder);
  private apiService = inject(ApiService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private destroyRef = inject(DestroyRef);

  editProductId: string | null = null;
  readonly isEditing = signal(false);
  readonly isLoading = signal(false);

  categoryList = [
    'Living room',
    'Bedroom',
    'Dining room',
    'Home office',
    'Outdoor',
  ];

  materialList = ['Wood', 'Metal', 'Plastic', 'Glass', 'Other'];

  colorList = [
    'white',
    'black',
    'grey',
    'red',
    'green',
    'blue',
    'orange',
    'yellow',
    'brown',
    'purple',
    'pink',
  ];

  addProductForm = this.fb.group({
    name: ['', Validators.required],
    description: ['', Validators.required],
    shortDescription: ['', [Validators.required, Validators.maxLength(200)]],
    images: this.fb.array([this.fb.control('', Validators.required)]),
    category: [[''], Validators.required],
    style: ['', Validators.required],
    height: ['', Validators.required],
    width: ['', Validators.required],
    depth: ['', Validators.required],
    material: [[''], Validators.required],
    color: ['', Validators.required],
    price: ['', Validators.required],
    inStock: [true],
  });

  get images(): FormArray<FormControl<string | null>> {
    return this.addProductForm.get('images') as FormArray<FormControl<string | null>>;
  }

  addImageInput() {
    this.images.push(this.fb.control('', Validators.required));
  }

  removeImageInput(index: number) {
    if (this.images.length > 1) this.images.removeAt(index);
  }

  ngOnInit(): void {
    this.activatedRoute.params
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((params) => {
        const editedProductSlug = params['slug'] || null;
        if (editedProductSlug) {
          this.isEditing.set(true);

          this.apiService
            .getProduct(editedProductSlug)
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe((currentProd) => {
              this.editProductId = currentProd._id;
              const { dimensions, images, ...editProduct } = currentProd;
              this.images.clear();
              (images || []).forEach((url) =>
                this.images.push(this.fb.control(url, Validators.required))
              );
              this.addProductForm.patchValue({
                width: String(dimensions.width),
                height: String(dimensions.height),
                depth: String(dimensions.depth),
                name: editProduct.name,
                category: editProduct.category ?? [],
                color: editProduct.color,
                description: editProduct.description,
                shortDescription: editProduct.shortDescription,
                material: editProduct.material,
                price: String(editProduct.price),
                style: editProduct.style,
                inStock: editProduct.inStock,
              });
            });
        }
      });
  }

  handleClick() {
    if (this.addProductForm.invalid) {
      return;
    }

    this.isLoading.set(true);
    const { width, height, depth, images, ...values } = this.addProductForm.value;
    const dimensions = {
      width: Number(width),
      height: Number(height),
      depth: Number(depth),
    };
    const data = {
      name: values.name || '',
      description: values.description || '',
      shortDescription: values.shortDescription || '',
      images: (images || []).filter((u): u is string => !!u && u.length > 0),
      category: Array.isArray(values.category) ? values.category : [],
      style: values.style || '',
      material: Array.isArray(values.material) ? values.material : [],
      color: values.color || '',
      price: Number(values.price) || 0,
      inStock: values.inStock ?? true,
      dimensions,
    };

    if (this.isEditing() && this.editProductId) {
      this.apiService
        .updateProduct(this.editProductId, data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((updated) => {
          this.isLoading.set(false);
          this.router.navigate([`/products/${updated.slug}`]);
        });
    } else {
      this.apiService
        .addProduct(data)
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe(() => {
          this.isLoading.set(false);
          this.router.navigate(['/products']);
        });
    }
  }
}
