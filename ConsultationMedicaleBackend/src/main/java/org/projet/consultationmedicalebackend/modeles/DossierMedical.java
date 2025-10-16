package org.projet.consultationmedicalebackend.modeles;

import jakarta.persistence.*;

@Entity
@Table(name = "DOSSIER_MEDICAL")
public class DossierMedical {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String groupeSanguin;

    private String allergies;

    private String vaccinations;

    private String antecedentsMedicaux;

    private String remarques;

    @OneToOne
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public DossierMedical() {
    }

    public DossierMedical(String groupeSanguin, String allergies, String vaccinations, String antecedentsMedicaux, String remarques, Patient patient) {
        this.groupeSanguin = groupeSanguin;
        this.allergies = allergies;
        this.vaccinations = vaccinations;
        this.antecedentsMedicaux = antecedentsMedicaux;
        this.remarques = remarques;
        this.patient = patient;
    }

    public Long getId() {
        return id;
    }

    public String getGroupeSanguin() {
        return groupeSanguin;
    }

    public void setGroupeSanguin(String groupeSanguin) {
        this.groupeSanguin = groupeSanguin;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }

    public String getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(String vaccinations) {
        this.vaccinations = vaccinations;
    }

    public String getAntecedentsMedicaux() {
        return antecedentsMedicaux;
    }

    public void setAntecedentsMedicaux(String antecedentsMedicaux) {
        this.antecedentsMedicaux = antecedentsMedicaux;
    }

    public String getRemarques() {
        return remarques;
    }

    public void setRemarques(String remarques) {
        this.remarques = remarques;
    }

    public Patient getPatient() {
        return patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }
}
