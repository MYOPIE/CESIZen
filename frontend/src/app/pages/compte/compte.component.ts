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
      }
    });
  }

  switchView(view: 'login' | 'register' | 'forgot'): void {
    this.currentView = view;
    this.clearMessages();
  }

  validatePassword(password: string): boolean {
    // Minimum 8 caractères, une majuscule, une minuscule, un chiffre
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
    return regex.test(password);
  }

  onForgotPassword(): void {
    if (!this.forgotEmail) {
      this.errorMessage = 'Veuillez renseigner votre adresse e-mail.';
      this.clearErrorAfterDelay();
      return;
    }
    
    // Simulation d'envoi d'e-mail de réinitialisation
    this.errorMessage = '';
    this.successMessage = 'Si votre compte existe, un e-mail de réinitialisation de mot de passe a bien été envoyé.';
    this.forgotEmail = '';
    this.switchView('login');
  }

  onLogin(): void {
    if (this.loginForm.email && this.loginForm.password) {
      this.authService.login(this.loginForm).subscribe({
        next: (response) => {
          this.errorMessage = '';
          this.successMessage = 'Connexion réussie !';
          this.clearMessages();
        },
        error: (err) => {
          this.successMessage = '';
          this.errorMessage = err.error?.message || 'Identifiants incorrects';
          this.clearErrorAfterDelay();
        }
      });
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.clearErrorAfterDelay();
    }
  }

  onRegister(): void {
    if (!this.registerForm.firstName || !this.registerForm.lastName || !this.registerForm.email || !this.registerForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.clearErrorAfterDelay();
      return;
    }

    if (!this.validatePassword(this.registerForm.password)) {
      this.errorMessage = 'Le mot de passe doit faire au moins 8 caractères, et contenir au moins une majuscule, une minuscule et un chiffre.';
      this.clearErrorAfterDelay();
      return;
    }

    if (this.registerForm.password !== this.registerForm.confirmPassword) {
      this.errorMessage = 'Les mots de passe ne correspondent pas';
      this.clearErrorAfterDelay();
      return;
    }

    if (!this.registerForm.acceptTerms) {
      this.errorMessage = 'Vous devez accepter les conditions d\'utilisation';
      this.clearErrorAfterDelay();
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
        this.successMessage = 'Inscription réussie ! Vous pouvez maintenant vous connecter.';
        this.switchView('login');
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error?.message || 'Erreur lors de l\'inscription';
        this.clearErrorAfterDelay();
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
    this.clearMessages();
  }

  onUpdateProfile(): void {
    if (!this.userProfile.id || !this.userProfile.firstName || !this.userProfile.lastName) {
      this.errorMessage = 'Le prénom et le nom sont requis.';
      this.clearErrorAfterDelay();
      return;
    }

    if (this.updatePassword && !this.validatePassword(this.updatePassword)) {
      this.errorMessage = 'Le mot de passe doit faire au moins 8 caractères, et contenir au moins une majuscule, une minuscule et un chiffre.';
      this.clearErrorAfterDelay();
      return;
    }

    if (this.updatePassword && this.updatePassword !== this.confirmUpdatePassword) {
      this.errorMessage = 'Les nouveaux mots de passe ne correspondent pas.';
      this.clearErrorAfterDelay();
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
        this.clearMessages();
      },
      error: (err) => {
        this.successMessage = '';
        this.errorMessage = err.error || 'Erreur lors de la mise à jour du profil';
        this.clearErrorAfterDelay();
      }
    });
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      // Pour l'instant, seulement déconnecter
      this.authService.logout();
      this.successMessage = 'Compte supprimé avec succès';
      this.clearMessages();
    }
  }

  clearMessages(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 2000);
  }

  clearErrorAfterDelay(): void {
    if (this.messageTimeout) {
      clearTimeout(this.messageTimeout);
    }
    this.messageTimeout = setTimeout(() => {
      this.errorMessage = '';
      this.cdr.detectChanges();
    }, 2000);
  }
}
