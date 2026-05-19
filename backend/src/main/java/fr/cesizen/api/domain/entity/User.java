package fr.cesizen.api.domain.entity;

import java.time.LocalDateTime;
import java.util.Set;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Column(nullable = false)
    private Boolean isActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @ManyToMany
    @JoinTable(
        name = "user_favorite_activities",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "activity_id")
    )
    private Set<Activity> favoriteActivities;

    @ManyToMany
    @JoinTable(
        name = "user_favorite_informations",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "information_id")
    )
    private Set<Information> favoriteInformations;

    // ── Constructeurs ──────────────────────────────────────────

    public User() {}

    public User(Long id, String email, String firstName, String lastName,
                String password, Role role, Boolean isActive,
                LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.role = role;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // ── Getters ────────────────────────────────────────────────

    public Long getId()                  { return id; }
    public String getEmail()             { return email; }
    public String getFirstName()         { return firstName; }
    public String getLastName()          { return lastName; }
    public String getPassword()          { return password; }
    public Role getRole()                { return role; }
    public Boolean getIsActive()         { return isActive; }
    public LocalDateTime getCreatedAt()  { return createdAt; }
    public LocalDateTime getUpdatedAt()  { return updatedAt; }
    public Set<Activity> getFavoriteActivities() { return favoriteActivities; }
    public Set<Information> getFavoriteInformations() { return favoriteInformations; }

    // ── Setters ────────────────────────────────────────────────

    public void setId(Long id)                         { this.id = id; }
    public void setEmail(String email)                 { this.email = email; }
    public void setFirstName(String firstName)         { this.firstName = firstName; }
    public void setLastName(String lastName)           { this.lastName = lastName; }
    public void setPassword(String password)           { this.password = password; }
    public void setRole(Role role)                     { this.role = role; }
    public void setIsActive(Boolean isActive)          { this.isActive = isActive; }
    public void setCreatedAt(LocalDateTime createdAt)  { this.createdAt = createdAt; }
    public void setUpdatedAt(LocalDateTime updatedAt)  { this.updatedAt = updatedAt; }
    public void setFavoriteActivities(Set<Activity> favoriteActivities) {
        this.favoriteActivities = favoriteActivities;
    }
    public void setFavoriteInformations(Set<Information> favoriteInformations) {
        this.favoriteInformations = favoriteInformations;
    }

    // ── Builder manuel ─────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String email, firstName, lastName, password;
        private Role role;
        private Boolean isActive;
        private LocalDateTime createdAt, updatedAt;
        private Set<Activity> favoriteActivities;
        private Set<Information> favoriteInformations;
        
        public Builder id(Long id)                         { this.id = id; return this; }
        public Builder email(String email)                 { this.email = email; return this; }
        public Builder firstName(String firstName)         { this.firstName = firstName; return this; }
        public Builder lastName(String lastName)           { this.lastName = lastName; return this; }
        public Builder password(String password)           { this.password = password; return this; }
        public Builder role(Role role)                     { this.role = role; return this; }
        public Builder isActive(Boolean isActive)          { this.isActive = isActive; return this; }
        public Builder createdAt(LocalDateTime createdAt)  { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt)  { this.updatedAt = updatedAt; return this; }
        public Builder favoriteActivities(Set<Activity> favoriteActivities) {
            this.favoriteActivities = favoriteActivities;
            return this;
        }
        public Builder favoriteInformations(Set<Information> favoriteInformations) {
            this.favoriteInformations = favoriteInformations;
            return this;
        }
        public User build() {
            return new User(id, email, firstName, lastName,
                            password, role, isActive, createdAt, updatedAt);
        }
    }

    // ── Lifecycle JPA ──────────────────────────────────────────

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (isActive == null) isActive = true;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}