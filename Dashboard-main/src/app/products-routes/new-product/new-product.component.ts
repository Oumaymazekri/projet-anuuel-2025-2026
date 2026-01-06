import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ProductServiceService } from '../../product-service.service';

@Component({
  selector: 'app-new-product',
  templateUrl: './new-product.component.html',
  styleUrls: ['./new-product.component.css']
})
export class NewProductComponent implements OnInit {
  public productForm: FormGroup;
  public imagePreviews: string[] = [];

  // Listes statiques selon ton modèle Go
  public categories: string[] = ['Phones', 'Cameras', 'Power', 'Tablets','Audio'];
  public tailles: string[] = ['Compact', 'Standar', 'Inear', 'Wireless',];
  public couleurs: string[] = ['Red', 'Blue', 'Green', 'Black', 'White'];
  public marques: string[] = ['Iphone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Sony', 'LG', 'Nokia', 'Motorola', 'Google','Nikon','Sony','Canon','Fujifilm','Panasonic','Leica','Olympus','Pentax','Sigma','Tamron','Tokina','Zeiss','Other','Bose','Other'];

  public selectedImage: string | null = null;
  public showImageModal = false;

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private productService: ProductServiceService,
  ) {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      category: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      taille: [''],
      marque: [''],
      couleur: [''],
      caracteristique: [''],
      stock: [0, [Validators.required, Validators.min(0)]],
      rating: [0, [Validators.min(0), Validators.max(5)]], // rating max 5 ?
      images: [[]] // stockera File[]
    });
  }

  ngOnInit(): void {
    // Pas besoin d’appeler service catégories si static
  }

  openImagePicker(): void {
    this.imageInput.nativeElement.click();
  }

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const files = Array.from(input.files);
      this.imagePreviews = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = () => {
          this.imagePreviews.push(reader.result as string);
        };
        reader.readAsDataURL(file);
      });

      this.productForm.patchValue({ images: files });
    }
  }


  removeImage(index: number): void {
    this.imagePreviews.splice(index, 1);
    const files = this.productForm.value.images as File[];
    files.splice(index, 1);
    this.productForm.patchValue({ images: files });
  }

  onSubmit(): void {
    if (this.productForm.valid) {
      const formData = new FormData();

      // Ajout des champs texte
      Object.entries(this.productForm.controls).forEach(([key, control]) => {
        if (key !== 'images') {
          const value = control.value;
          if (value !== null && value !== undefined) {
            formData.append(key, value.toString());
          }
        }
      });

      // Ajout des fichiers images (upload multiple)
      const files: File[] = this.productForm.get('images')?.value || [];
      files.forEach(file => {
        formData.append('images', file);
      });

      this.productService.postProduct(formData).subscribe({
        next: () => {
          this.toastr.success('Product added successfully');
          this.productForm.reset();
          this.imagePreviews = [];
        },
        error: err => {
          console.error('Error adding product:', err);
          this.toastr.error('A problem occurred when adding the product');
        }
      });
    } else {
      this.toastr.warning('Please fill the form correctly');
    }
  }

  openImageModal(image: string): void {
    this.selectedImage = image;
    this.showImageModal = true;
  }

  closeImageModal(): void {
    this.selectedImage = null;
    this.showImageModal = false;
  }
}
