import { Routes } from '@angular/router';

import { isGuestGuard, isUserGuard } from './guards/auth.guard';

const productRoutes = {
  path: 'products',
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./main/products/products.component').then(
          (m) => m.ProductsComponent
        ),
    },
    {
      path: ':slug',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('./main/product-details/product-details.component').then(
              (m) => m.ProductDetailsComponent
            ),
        },
        {
          path: 'edit',
          loadComponent: () =>
            import('./main/add-product/add-product.component').then(
              (m) => m.AddProductComponent
            ),
          canActivate: [isUserGuard],
        },
      ],
    },
  ],
};

const authRoutes = {
  path: 'auth',
  canActivate: [isGuestGuard],
  children: [
    {
      path: 'login',
      loadComponent: () =>
        import('./auth/login/login.component').then((m) => m.LoginComponent),
    },
    {
      path: 'register',
      loadComponent: () =>
        import('./auth/register/register.component').then(
          (m) => m.RegisterComponent
        ),
    },
  ],
};

const profileRoutes = {
  path: 'profile',
  canActivate: [isUserGuard],
  children: [
    {
      path: '',
      loadComponent: () =>
        import('./auth/profile/profile.component').then(
          (m) => m.ProfileComponent
        ),
    },
    {
      path: 'wishlist',
      loadComponent: () =>
        import('./auth/wishlist/wishlist.component').then(
          (m) => m.WishlistComponent
        ),
    },
    {
      path: 'orders',
      loadComponent: () =>
        import('./auth/orders/orders.component').then((m) => m.OrdersComponent),
    },
  ],
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./main/home/home.component').then((m) => m.HomeComponent),
  },
  productRoutes,
  {
    path: 'add-product',
    loadComponent: () =>
      import('./main/add-product/add-product.component').then(
        (m) => m.AddProductComponent
      ),
    canActivate: [isUserGuard],
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./auth/cart/cart.component').then((m) => m.CartComponent),
    canActivate: [isUserGuard],
  },
  authRoutes,
  profileRoutes,
  {
    path: '**',
    loadComponent: () =>
      import('./main/not-found/not-found.component').then(
        (m) => m.NotFoundComponent
      ),
  },
];
