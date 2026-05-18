package fr.cesizen.api.domain.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "categories")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String type;

    // ── Constructeurs ────────────────────────────────────────────────

    public Category() {}

    public Category(Long id, String name, String type) {
        this.id = id;
        this.name = name;
        this.type = type;
    }

    // ── Getters ────────────────────────────────────────────────

    public Long getId()       { return id; }
    public String getName()   { return name; }
    public String getType()   { return type; }

    // ── Setters ────────────────────────────────────────────────

    public void setId(Long id)       { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setType(String type) { this.type = type; }

    // ── Builder manuel ───────────────────────────────────────────────

    public static Builder builder() { return new Builder(); }

    public static class Builder {
        private Long id;
        private String name;
        private String type;

        public Builder id(Long id)         { this.id = id; return this; }
        public Builder name(String name)   { this.name = name; return this; }
        public Builder type(String type)   { this.type = type; return this; }

        public Category build() {
            return new Category(id, name, type);
        }
    }
}
