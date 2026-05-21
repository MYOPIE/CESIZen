import { describe, expect, it, vi } from 'vitest';
import { BehaviorSubject, of } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { CompteComponent } from './compte.component';
import { AuthService, AuthResponse, UserResponse } from '../../services/auth.service';

describe('CompteComponent', () => {
  const currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  const authService = {
    currentUser$: currentUser$.asObservable(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    updateProfile: vi.fn()
  } as unknown as AuthService;

  const cdr = {
    detectChanges: vi.fn()
  } as unknown as ChangeDetectorRef;

  const resetState = () => {
    currentUser$.next(null);
    vi.clearAllMocks();
  };

  beforeEach(() => {
    resetState();
  });

  function createComponent(): CompteComponent {
    return new CompteComponent(authService, cdr);
  }

  it('validates email and password rules', () => {
    const component = createComponent();

    expect(component.validateEmail('user@example.com')).toBe(true);
    expect(component.validateEmail('bad-email')).toBe(false);
    expect(component.validatePassword('Password1')).toBe(true);
    expect(component.validatePassword('password')).toBe(false);
  });

  it('reports an error when login fields are incomplete', () => {
    const component = createComponent();

    component.onLogin();

    expect(component.errorMessage).toBe('Veuillez remplir tous les champs');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('keeps the login flow on the validation path when the email is invalid', () => {
    const component = createComponent();
    component.loginForm = { email: 'invalid-email', password: 'Password1' };

    component.onLogin();

    expect(component.errorMessage).toBe('Veuillez renseigner une adresse e-mail valide.');
    expect(authService.login).not.toHaveBeenCalled();
  });

  it('registers and logs the user in for a valid submission', () => {
    const component = createComponent();
    const registrationResponse: AuthResponse = { message: 'Compte créé' };
    const loginResponse: AuthResponse = {
      message: 'Connexion OK',
      token: 'jwt-token'
    };

    (authService.register as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of(registrationResponse));
    (authService.login as unknown as ReturnType<typeof vi.fn>).mockReturnValue(of(loginResponse));

    component.registerForm = {
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      acceptTerms: true
    };

    component.onRegister();

    expect(authService.register).toHaveBeenCalledWith({
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com',
      password: 'Password1',
      confirmPassword: 'Password1'
    });
    expect(authService.login).toHaveBeenCalledWith({
      email: 'marie.curie@example.com',
      password: 'Password1'
    });
    expect(component.successMessage).toBe('Inscription et connexion réussies !');
  });

  it('blocks registration when the passwords do not match', () => {
    const component = createComponent();
    component.registerForm = {
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com',
      password: 'Password1',
      confirmPassword: 'Password2',
      acceptTerms: true
    };

    component.onRegister();

    expect(component.errorMessage).toBe('Les mots de passe ne correspondent pas');
    expect(authService.register).not.toHaveBeenCalled();
  });

  it('logs out and resets the local form state', () => {
    const component = createComponent();
    component.loginForm = { email: 'user@example.com', password: 'Password1' };
    component.registerForm = {
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com',
      password: 'Password1',
      confirmPassword: 'Password1',
      acceptTerms: true
    };

    component.onLogout();

    expect(authService.logout).toHaveBeenCalledTimes(1);
    expect(component.successMessage).toBe('Déconnexion réussie');
    expect(component.loginForm).toEqual({ email: '', password: '' });
    expect(component.registerForm).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false
    });
  });

  it('switches back to the login view when the current user disappears', () => {
    const component = createComponent();
    component.currentView = 'register';

    component.ngOnInit();
    currentUser$.next(null);

    expect(component.currentView).toBe('login');
    currentUser$.next(null);
  });

  it('reports a useful message when forgot password is triggered without an email', () => {
    const component = createComponent();

    component.onForgotPassword();

    expect(component.errorMessage).toBe('Veuillez renseigner votre adresse e-mail.');
  });

  it('allows the profile update without changing the password when the email stays the same', () => {
    const component = createComponent();

    component.userProfile = {
      id: 1,
      firstName: 'Marie',
      lastName: 'Curie',
      email: 'marie.curie@example.com'
    };
    (component as unknown as { originalEmail: string }).originalEmail = 'marie.curie@example.com';

    expect(component.isUpdateDisabled()).toBe(false);
  });

  it('blocks profile update and shows the current password prompt when the email changes', () => {
    const component = createComponent();

    component.userProfile = {
      id: 7,
      email: 'new@example.com',
      firstName: 'Marie',
      lastName: 'Curie'
    };
    (component as unknown as { originalEmail: string }).originalEmail = 'marie.curie@example.com';

    expect(component.hasEmailChanged()).toBe(true);
    expect(component.isUpdateDisabled()).toBe(true);

    component.currentPassword = 'current-password';

    expect(component.isUpdateDisabled()).toBe(false);
  });

  it('updates the profile with the modified email once the current password is provided', () => {
    const component = createComponent();
    const updatedUser: UserResponse = {
      id: 7,
      email: 'new@example.com',
      firstName: 'Marie',
      lastName: 'Curie',
      role: 'ROLE_USER',
      isActive: true,
      createdAt: '2026-01-01T00:00:00Z',
      updatedAt: '2026-01-02T00:00:00Z'
    };

    (authService.updateProfile as ReturnType<typeof vi.fn>).mockReturnValue(of(updatedUser));

    component.userProfile = {
      id: 7,
      email: 'new@example.com',
      firstName: 'Marie',
      lastName: 'Curie'
    };
    (component as unknown as { originalEmail: string }).originalEmail = 'marie.curie@example.com';
    component.currentPassword = 'current-password';

    component.onUpdateProfile();

    expect(authService.updateProfile).toHaveBeenCalledWith(7, {
      email: 'new@example.com',
      firstName: 'Marie',
      lastName: 'Curie',
      password: '',
      confirmPassword: '',
      currentPassword: 'current-password'
    });
    expect(component.successMessage).toBe('Profil mis à jour avec succès !');
  });

  it('switches to the password change flow when a new password is entered', () => {
    const component = createComponent();

    component.userProfile = {
      id: 8,
      email: 'user@example.com',
      firstName: 'Jean',
      lastName: 'Dupont'
    };
    (component as unknown as { originalEmail: string }).originalEmail = 'user@example.com';
    component.updatePassword = 'Password1';
    component.confirmUpdatePassword = 'Password1';

    expect(component.requiresCurrentPassword()).toBe(false);
    expect(component.isUpdateDisabled()).toBe(false);
  });
});