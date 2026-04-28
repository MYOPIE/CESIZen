package fr.cesizen.api.domain.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

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

    // ── Builder manuel ─────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String email, firstName, lastName, password;
        private Role role;
        private Boolean isActive;
        private LocalDateTime createdAt, updatedAt;

        public Builder id(Long id)                         { this.id = id; return this; }
        public Builder email(String email)                 { this.email = email; return this; }
        public Builder firstName(String firstName)         { this.firstName = firstName; return this; }
        public Builder lastName(String lastName)           { this.lastName = lastName; return this; }
        public Builder password(String password)           { this.password = password; return this; }
        public Builder role(Role role)                     { this.role = role; return this; }
        public Builder isActive(Boolean isActive)          { this.isActive = isActive; return this; }
        public Builder createdAt(LocalDateTime createdAt)  { this.createdAt = createdAt; return this; }
        public Builder updatedAt(LocalDateTime updatedAt)  { this.updatedAt = updatedAt; return this; }

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