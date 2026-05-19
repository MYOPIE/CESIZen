import { describe, expect, it } from 'vitest';
import { BehaviorSubject } from 'rxjs';
import { NavbarComponent } from './navbar.component';
import { AuthService, UserResponse } from '../../services/auth.service';

describe('NavbarComponent', () => {
  const currentUser$ = new BehaviorSubject<UserResponse | null>(null);

  const authService = {
    currentUser$: currentUser$.asObservable()
  } as unknown as AuthService;

  const user: UserResponse = {
    id: 3,
    email: 'marie.curie@example.com',
    firstName: 'Marie',
    lastName: 'Curie',
    role: 'ROLE_USER',
    isActive: true,
    createdAt: '2026-01-01T00:00:00Z',
    updatedAt: '2026-01-02T00:00:00Z'
  };

  function createComponent(): NavbarComponent {
    return new NavbarComponent(authService);
  }

  it('toggles the mobile menu state', () => {
    const component = createComponent();

    expect(component.isMenuOpen).toBe(false);

    component.toggleMenu();
    expect(component.isMenuOpen).toBe(true);

    component.closeMenu();
    expect(component.isMenuOpen).toBe(false);
  });

  it('formats the display name from the current user', () => {
    const component = createComponent();
    component.currentUser = user;

    expect(component.userDisplayName).toBe('Marie CURIE');
  });

  it('refreshes the current user from the auth stream', () => {
    const component = createComponent();

    component.ngOnInit();
    currentUser$.next(user);

    expect(component.currentUser).toEqual(user);
    currentUser$.next(null);
  });
});