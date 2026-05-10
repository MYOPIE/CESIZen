import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, UserResponse } from '../../services/auth.service';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss'
})
export class CompteComponent implements OnInit {
  isConnected = false;
  currentView: 'login' | 'register' | 'forgot' = 'login';
  successMessage = '';
  errorMessage = '';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  forgotEmail = '';

  userProfile: Partial<UserResponse> = {};

  updatePassword = '';
  confirmUpdatePassword = '';

  private messageTimeout: any;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.isConnected = !!user;
      if (user) {
        this.userProfile = user;
      } else {
        this.userProfile = {};
        this.currentView = 'login';
      }
      this.cdr.detectChanges();
    });
  }

  switchView(view: 'login' | 'register' | 'forgot'): void {
    this.currentView = view;
    this.successMessage = '';
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  hasMinLength(password: string): boolean {
    return password ? password.length >= 8 : false;
  }

  hasUpperCase(password: string): boolean {
    return password ? /[A-Z]/.test(password) : false;
  }

  hasLowerCase(password: string): boolean {
    return password ? /[a-z]/.test(password) : false;
  }

  hasNumber(password: string): boolean {
    return password ? /\d/.test(password) : false;
  }

  validatePassword(password: string): boolean {
    // Minimum 8 caractères, une majuscule, une minuscule, un chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  onForgotPassword(): void {
    if (!this.forgotEmail) {
      this.errorMessage = 'Veuillez renseigner votre adresse e-mail.';
      this.cdr.detectChanges();
      return;
    }
    
    // Simulation d'envoi d'e-mail de réinitialisation
    this.errorMessage = '';
    this.successMessage = 'Si votre compte existe, un e-mail de réinitialisation de mot de passe a bien été envoyé.';
    this.forgotEmail = '';
    this.switchView('login');
  }

  onLogin(): void {
    if (!this.loginForm.email || !this.loginForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.cdr.detectChanges();
      return;
    }

    if (!this.validateEmail(this.loginForm.email)) {
      this.errorMessage = 'Veuillez renseigner une adresse e-mail valide.';
      this.cdr.detectChanges();
      return;
    }

    this.authService.login(this.loginForm).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.successMessage = 'Connexion réussie !';
        this.cdr.detectChanges();
        this.clearMessageAfterDelay();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Identifiants incorrects';
        this.cdr.detectChanges();
      }
    });
  }

  onRegister(): void {
    if (!this.registerForm.firstName || !this.registerForm.lastName || !this.registerForm.email || !this.registerForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.cdr.detectChanges();
      return;
    }

    if (!this.validateEmail(this.registerForm.email)) {
      this.errorMessage = 'Veuillez renseigner une adresse e-mail valide pour l\'inscription.';
      this.cdr.detectChanges();
      return;
    }

    if (!this.validatePassword(this.registerForm.password)) {
      this.errorMessage = 'Le mot de passe doit faire au moins 8 caractères, et contenir au moins une majuscule, une minuscule et un chiffre.';
      this.cdr.detectChanges();
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.cdr.detectChanges();
      return;
    }

    if (!this.registerForm.acceptTerms) {
      this.errorMessage = 'Vous devez accepter les conditions d\'utilisation';
      this.cdr.detectChanges();
      return;
    }

    this.authService.register({
      firstName: this.registerForm.firstName,
      lastName: this.registerForm.lastName,
      email: this.registerForm.email,
      password: this.registerForm.password,
      confirmPassword: this.registerForm.confirmPassword
    }).subscribe({
      next: (response) => {
        this.errorMessage = '';
        this.successMessage = 'Inscription réussie ! Connexion en cours...';
        this.cdr.detectChanges();
        this.clearMessageAfterDelay();
        
        this.authService.login({
          email: this.registerForm.email,
          password: this.registerForm.password
        }).subscribe({
          next: () => {
            this.successMessage = 'Inscription et connexion réussies !';
            this.cdr.detectChanges();
            this.clearMessageAfterDelay();
          },
          error: () => {
            this.errorMessage = 'Inscription réussie, mais échec de la connexion automatique. Veuillez vous connecter.';
            this.switchView('login');
            this.cdr.detectChanges();
          }
        });
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
        this.cdr.detectChanges();
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.loginForm = { email: '', password: '' };
    this.registerForm = { firstName: '', lastName: '', email: '', password: '', confirmPassword: '', acceptTerms: false };
    this.updatePassword = '';
    this.confirmUpdatePassword = '';
    this.errorMessage = '';
    this.successMessage = 'Déconnexion réussie';
    this.cdr.detectChanges();
    this.clearMessageAfterDelay();
  }

  onUpdateProfile(): void {
    if (!this.userProfile.id || !this.userProfile.firstName || !this.userProfile.lastName) {
      this.errorMessage = 'Le prénom et le nom sont requis.';
      this.cdr.detectChanges();
      return;
    }

    if (this.updatePassword && !this.validatePassword(this.updatePassword)) {
      this.errorMessage = 'Le mot de passe doit faire au moins 8 caractères, et contenir au moins une majuscule, une minuscule et un chiffre.';
      this.cdr.detectChanges();
      return;
    }

    if (this.updatePassword && this.updatePassword !== this.confirmUpdatePassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      this.cdr.detectChanges();
      return;
    }

    const updateRequest = {
      firstName: this.userProfile.firstName,
      lastName: this.userProfile.lastName,
      password: this.updatePassword || '',
      confirmPassword: this.confirmUpdatePassword || ''
    };

    this.authService.updateProfile(this.userProfile.id, updateRequest).subscribe({
      next: (updatedUser) => {
        this.errorMessage = '';
        this.successMessage = 'Profil mis à jour avec succès !';
        this.updatePassword = '';
        this.confirmUpdatePassword = '';
        this.cdr.detectChanges();
        this.clearMessageAfterDelay();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error || 'Erreur lors de la mise à jour du profil';
        this.cdr.detectChanges();
        this.clearMessageAfterDelay();
      }
    });
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      if (this.userProfile.id) {
        this.authService.deleteAccount(this.userProfile.id).subscribe({
          next: () => {
            this.authService.logout();
            this.successMessage = 'Compte supprimé avec succès';
            this.cdr.detectChanges();
          },
          error: (err) => {
            this.errorMessage = err.error || 'Erreur lors de la suppression du compte.';
            this.cdr.detectChanges();
            this.clearMessageAfterDelay();
          }
        });
      }
    }
  }

  clearMessageAfterDelay(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.errorMessage = '';
      this.successMessage = '';
      this.cdr.detectChanges();
    }, 1500);
  }
}
