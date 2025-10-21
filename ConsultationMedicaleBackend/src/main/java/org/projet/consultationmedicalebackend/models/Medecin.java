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

    @OneToMany(mappedBy = "medecin", cascade = CascadeType.ALL)
    private List<Consultation> consultations;

    public Medecin() {
        super();
    }

    public Medecin(String nom, String prenom, String adresse, String telephone, String email, String motDePasse, String specialite, String numINAMI, List<Consultation> consultations) {
        super(nom, prenom, adresse, telephone, email, motDePasse, RoleUtilisateur.MEDECIN);
        this.specialite = specialite;
        this.numINAMI = numINAMI;
        this.consultations = consultations;
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
}
