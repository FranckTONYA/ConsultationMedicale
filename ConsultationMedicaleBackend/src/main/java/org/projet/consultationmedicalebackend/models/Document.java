package org.projet.consultationmedicalebackend.models;

import jakarta.persistence.*;

@Entity
@Table(name = "DOCUMENT")
public class Document {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nom;

    @Enumerated(EnumType.STRING)
    private TypeDoc type;

    @Column(nullable = false)
    private String urlStockage;

    @ManyToOne
    @JoinColumn(name = "consultation_id")
    private Consultation consultation;

    public Document() {
    }

    public Document(String nom, TypeDoc type, String urlStockage, Consultation consultation) {
        this.nom = nom;
        this.type = type;
        this.urlStockage = urlStockage;
        this.consultation = consultation;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public TypeDoc getType() {
        return type;
    }

    public void setType(TypeDoc type) {
        this.type = type;
    }

    public String getUrlStockage() {
        return urlStockage;
    }

    public void setUrlStockage(String urlStockage) {
        this.urlStockage = urlStockage;
    }

    public Consultation getConsultation() {
        return consultation;
    }

    public void setConsultation(Consultation consultation) {
        this.consultation = consultation;
    }
}
