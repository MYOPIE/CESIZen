import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.scss'
})
export class CompteComponent {
  isConnected = false;
  showLoginForm = true;
  successMessage = '';
  errorMessage = '';

  loginForm = {
    email: '',
    password: ''
  };

  registerForm = {
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  userProfile = {
    pseudo: 'Jean Dupont',
    email: 'jean.dupont@example.com',
    dateCreation: '2024-01-15',
    role: 'Utilisateur'
  };

  toggleForm(): void {
    this.showLoginForm = !this.showLoginForm;
    this.clearMessages();
  }

  onLogin(): void {
    if (this.loginForm.email && this.loginForm.password) {
      this.isConnected = true;
      this.successMessage = 'Connexion réussie !';
      this.clearMessages();
    } else {
      this.errorMessage = 'Veuillez remplir tous les champs';
      this.clearErrorAfterDelay();
    }
  }

  onRegister(): void {
    if (!this.registerForm.pseudo || !this.registerForm.email || !this.registerForm.password) {
      this.errorMessage = 'Veuillez remplir tous les champs';
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

    this.isConnected = true;
    this.successMessage = 'Inscription réussie !';
    this.showLoginForm = true;
    this.clearMessages();
  }

  onLogout(): void {
    this.isConnected = false;
    this.showLoginForm = true;
    this.loginForm = { email: '', password: '' };
    this.registerForm = { pseudo: '', email: '', password: '', confirmPassword: '', acceptTerms: false };
    this.successMessage = 'Déconnexion réussie';
    this.clearMessages();
  }

  onDeleteAccount(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) {
      this.isConnected = false;
      this.successMessage = 'Compte supprimé avec succès';
      this.clearMessages();
    }
  }

  clearMessages(): void {
    setTimeout(() => {
      this.successMessage = '';
      this.errorMessage = '';
    }, 3000);
  }

  clearErrorAfterDelay(): void {
    setTimeout(() => {
      this.errorMessage = '';
    }, 3000);
  }
}
