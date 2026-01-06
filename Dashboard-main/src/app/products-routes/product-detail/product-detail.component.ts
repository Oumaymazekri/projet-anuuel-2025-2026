import { Component, OnInit, ViewChild, ElementRef } from '@angular/core'; 
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ToasterService } from '@coreui/angular';
import { CategoriesService } from 'src/app/categories.service';
import { TagsService } from 'src/app/tags.service';
import { ProductServiceService } from 'src/app/product-service.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  url = "http://localhost:3001/images";
  public product: any;
  public productForm!: FormGroup;
  public imagePreviews: string[] = [];
  public imageFiles: File[] = [];
  public toasts: any[] = [];
  public categories: string[] = ["Phones","Audio","Cameras","Tablets"];
  public tailles: string[] = ['Compact', 'Standard', 'In-Ear', 'Wireless'];
  public couleurs: string[] = ['Red', 'Blue', 'Green', 'Black', 'White'];
  public marques: string[] = ['Iphone', 'Samsung', 'Huawei', 'Xiaomi', 'Oppo', 'Sony', 'LG', 'Nokia', 'Motorola', 'Google', 'Nikon', 'Canon', 'Fujifilm', 'Bose', 'Other'];
  public tags: any[] = [];
  public selectedImage: string | null = null;
  public showImageModal = false;
  public isopen = false;
  public loading = false;
 

  @ViewChild('imageInput') imageInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    private toasterService: ToasterService,
    private catS: CategoriesService,
    private tagS: TagsService,
    private productService: ProductServiceService
  ) {}

  ngOnInit(): void {
    this.buildForm();
    this.getAllTags();
    this.getAllCategories();

    const stateProduct = history.state.product;
    if (!stateProduct) {
      this.toasts.push({
        body: 'Aucune donnée de produit reçue. Veuillez revenir à la liste.',
        color: 'warning',
        autohide: true,
        delay: 3000
      });
      this.router.navigate(['/products']);
      return;
    }

    this.product = stateProduct;

    // ✅ Correction ici : ajout du type pour `img: string`
    this.imagePreviews = Array.isArray(this.product.images)
  ? this.product.images.map((img: string) => `${this.url}/${img}`)
  : [];

    this.productForm.patchValue({
      ...this.product,
      images: this.product.images || []
    });
  }

  buildForm(): void {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      stock: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      taille: [''],
      marque: [''],
      couleur: [''],
      category: [''],
      tag: [''],
      caracteristique: [''],
      description: [''],
      images: [[]],
      rating: [0],
      featured: [false]
    });
  }

  getAllCategories(): void {
    this.catS.getAllCategories().subscribe({
      next: (data: any[]) => this.categories = data,
      error: (err) => console.error('Erreur récupération catégories', err)
    });
  }

  getAllTags(): void {
    this.tagS.getAllTags().subscribe({
      next: (data: any[]) => this.tags = data,
      error: (err) => console.error('Erreur récupération tags', err)
    });
  }

  getImageUrl(image: string): string {
  return image.startsWith('blob:') || image.startsWith('data:') || image.startsWith('http')
    ? image
    : `${this.url}/${image}`;
}

  openImagePicker(): void {
    this.imageInput.nativeElement.click();
  }

onImageChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    this.imageFiles = Array.from(input.files);

    // Génère les aperçus d'image
    this.imagePreviews = this.imageFiles.map(file => URL.createObjectURL(file));

    // ✅ Met à jour le champ `images` dans le formulaire avec les noms des fichiers
    this.productForm.patchValue({ images: this.imageFiles.map(file => file.name) });

    // ✅ Marque le champ comme "touched" pour que Angular sache qu’il y a eu un changement
    this.productForm.get('images')?.markAsDirty();
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

  openEditForm(): void {
    this.isopen = !this.isopen;
  }

removeImage(index: number): void {
  this.imagePreviews.splice(index, 1);
  this.imageFiles.splice(index, 1);

  // ✅ Met à jour le champ dans le form
  this.productForm.patchValue({ images: this.imageFiles.map(file => file.name) });
  this.productForm.get('images')?.markAsDirty();
}


onSubmit(): void {
  if (!this.product?.id) {
    this.toasts.push({
      body: 'Erreur : ID du produit manquant.',
      color: 'danger',
      autohide: true,
      delay: 3000
    });
    return;
  }

  if (this.productForm.invalid) {
    this.toasts.push({
      body: 'Veuillez remplir tous les champs requis',
      color: 'warning',
      autohide: true,
      delay: 3000
    });
    return;
  }

  const formData = new FormData();

  // ✅ Ajouter les fichiers image
  for (const file of this.imageFiles) {
    formData.append('images', file, file.name);
  }

  // ✅ Ajouter tous les autres champs sauf 'images'
  for (const key in this.productForm.value) {
    if (key !== 'images' && this.productForm.value[key] !== null && this.productForm.value[key] !== undefined) {
      formData.append(key, this.productForm.value[key]);
    }
  }

  formData.append('updateDate', new Date().toISOString());

  this.loading = true;

  this.productService.UpdateProduct(this.product.id, formData).subscribe({
    next: () => {
      this.toasts.push({
        body: 'Produit mis à jour avec succès',
        color: 'success',
        autohide: true,
        delay: 3000
      });
      this.router.navigate(['/products']);
    },
    error: (err) => {
      console.error(err);
      this.toasts.push({
        body: 'Erreur lors de la mise à jour',
        color: 'danger',
        autohide: true,
        delay: 3000
      });
    },
    complete: () => this.loading = false
  });
}


//   deleteProduct(id: string): void {
//     this.productService.deleteProductById(id)
// .subscribe({
//       next: () => {
//         this.toasts.push({
//           body: 'Produit supprimé avec succès',
//           color: 'success',
//           autohide: true,
//           delay: 3000
//         });
//         this.router.navigate(['/products']);
//       },
//       error: (err) => {
//         console.error(err);
//         this.toasts.push({
//           body: 'Erreur lors de la suppression du produit',
//           color: 'danger',
//           autohide: true,
//           delay: 3000
//         });
//       }
//     });
//   }
deleteProduct() {
  const productId = this.product?.id; // ou this.productForm.value.id

  if (!productId) {
    alert('Aucun produit sélectionné.');
    return;
  }

  if (confirm('Voulez-vous vraiment supprimer ce produit ?')) {
    this.productService.deleteProductById(productId).subscribe({
      next: () => {
        alert('Produit supprimé avec succès.');
        // Rediriger vers la liste ou autre action
        this.router.navigate(['/products']);
      },
      error: (err) => {
        console.error(err);
        alert('Erreur lors de la suppression.');
      }
    });
  }
}
}
