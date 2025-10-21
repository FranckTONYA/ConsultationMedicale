package org.projet.consultationmedicalebackend.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "PATIENT")
public class Patient extends Utilisateur{
    @Column(nullable = false, unique = true)
    private String niss;

    @Column(nullable = false)
    private String dateNaissance;

    @OneToOne
    @JoinColumn(name = "dossier_id")
    private DossierMedical dossierMedical;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL)
    private List<Consultation> consultations;

    public Patient() {
        super();
    }

    public Patient(String nom, String prenom, String adresse, String telephone, String email, String motDePasse, String niss, String dateNaissance, DossierMedical dossierMedical, List<Consultation> consultations) {
        super(nom, prenom, adresse, telephone, email, motDePasse, RoleUtilisateur.PATIENT);
        this.niss = niss;
        this.dateNaissance = dateNaissance;
        this.dossierMedical = dossierMedical;
        this.consultations = consultations;
    }

    public String getNiss() {
        return niss;
    }

    public void setNiss(String niss) {
        this.niss = niss;
    }

    public String getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(String dateNaissance) {
        this.dateNaissance = dateNaissance;
    }


    public DossierMedical getDossierMedical() {
        return dossierMedical;
    }

    public void setDossierMedical(DossierMedical dossierMedical) {
        this.dossierMedical = dossierMedical;
    }

    public List<Consultation> getConsultations() {
        return consultations;
    }

    public void setConsultations(List<Consultation> consultations) {
        this.consultations = consultations;
    }
}
