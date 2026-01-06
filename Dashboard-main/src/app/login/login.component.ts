import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { AuthentificationServiceService } from "../authentification-service.service"; // ajuste le chemin si nécessaire

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent {
  Email = "";
  Password = "";
  rememberMe = false;
  showPassword = false;
  errorMsg: string[] = [];

  constructor(
    private router: Router,
    private authService: AuthentificationServiceService
  ) {}

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

handleSubmit() {
  this.errorMsg = [];

  const errors: string[] = [];
  if (!this.Email) errors.push("Email is required");
  if (!this.Password) errors.push("Password is required");

  if (errors.length > 0) {
    this.errorMsg = errors;
    return;
  }

  const loginData = {
    Email: this.Email,
    Password: this.Password,
  };

  this.authService.login(loginData).subscribe({
    next: (response) => {
      console.log("Login success:", response);

      const token = response.token;
      const userRole = response.role;

      if (userRole === 'admin') {
        if (token) {
          localStorage.setItem('authToken', token);
        }
        this.router.navigate(['/overview']);
      } else {
        this.errorMsg = ["Accès refusé : seuls les administrateurs peuvent se connecter."];
      }
    },
    error: (error) => {
      console.error("Login error:", error);
      this.errorMsg = [error.error?.message || "Échec de la connexion"];
    }
  });
}


  loginWithGoogle() {
    console.log("Login with Google");
  }
}
