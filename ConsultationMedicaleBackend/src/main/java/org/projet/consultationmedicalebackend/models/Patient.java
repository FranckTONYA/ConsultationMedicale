package org.projet.consultationmedicalebackend.models;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.Date;
import java.util.List;

@Entity
@Table(name = "PATIENT")
public class Patient extends Utilisateur{
    @Column(nullable = false, unique = true)
    private String niss;

    @Column(nullable = false)
    private Date dateNaissance;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval = true)
    @JoinColumn(name = "dossier_id")
    @JsonManagedReference
    private DossierMedical dossierMedical;

    @OneToMany(mappedBy = "patient", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consultation> consultations;

    public Patient() {
        super();
    }

    public Patient(String nom, String prenom, String adresse, String telephone, String email, String motDePasse, String niss, Date dateNaissance, DossierMedical dossierMedical, List<Consultation> consultations) {
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

    public Date getDateNaissance() {
        return dateNaissance;
    }

    public void setDateNaissance(Date dateNaissance) {
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
