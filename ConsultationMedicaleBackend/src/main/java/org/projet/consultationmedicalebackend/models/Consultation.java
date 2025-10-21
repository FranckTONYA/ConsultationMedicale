package org.projet.consultationmedicalebackend.models;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CONSULTATION")
public class Consultation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime dateHeure;

    private String compteRendu;

    private String lienReunion;

    @Enumerated(EnumType.STRING)
    private StatutRDV statut;

    @ManyToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    @OneToMany(mappedBy = "consultation", cascade = CascadeType.ALL)
    private List<Document> documents;

    public Consultation() {
    }

    public Consultation(LocalDateTime dateHeure, String compteRendu, String lienReunion, StatutRDV statut, Patient patient, Medecin medecin, List<Document> documents) {
        this.dateHeure = dateHeure;
        this.compteRendu = compteRendu;
        this.lienReunion = lienReunion;
        this.statut = statut;
        this.patient = patient;
        this.medecin = medecin;
        this.documents = documents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateHeure() {
        return dateHeure;
    }

    public void setDateHeure(LocalDateTime dateHeure) {
        this.dateHeure = dateHeure;
    }

    public String getCompteRendu() {
        return compteRendu;
    }

    public void setCompteRendu(String compteRendu) {
        this.compteRendu = compteRendu;
    }

    public String getLienReunion() {
        return lienReunion;
    }

    public void setLienReunion(String lienReunion) {
        this.lienReunion = lienReunion;
    }

    public StatutRDV getStatut() {
        return statut;
    }

    public void setStatut(StatutRDV statut) {
        this.statut = statut;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public List<Document> getDocuments() {
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }
}
