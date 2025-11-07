package org.projet.consultationmedicalebackend.models;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "MEDECIN")
public class Medecin extends Utilisateur {

    @Column(nullable = false)
    private String specialite;

    @Column(nullable = false, unique = true)
    private String numINAMI;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Consultation> consultations;

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Patient> patients;

    public Medecin() {
        super();
    }

    public Medecin(String nom, String prenom, String adresse, String telephone, String email, String motDePasse, String specialite, String numINAMI, List<Consultation> consultations, List<Patient> patients) {
        super(nom, prenom, adresse, telephone, email, motDePasse, RoleUtilisateur.MEDECIN);
        this.specialite = specialite;
        this.numINAMI = numINAMI;
        this.consultations = consultations;
        this.patients = patients;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getNumINAMI() {
        return numINAMI;
    }

    public void setNumINAMI(String numINAMI) {
        this.numINAMI = numINAMI;
    }

    public List<Consultation> getConsultations() {
        return consultations;
    }

    public void setConsultations(List<Consultation> consultations) {
        this.consultations = consultations;
    }

    public List<Patient> getPatients() {
        return patients;
    }

    public void setPatients(List<Patient> patients) {
        this.patients = patients;
    }
}
