package org.projet.consultationmedicalebackend.models;
import jakarta.persistence.*;

@Entity
@Table(name = "PLANNING_MEDECIN")
public class PlanningMedecin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String startDate;

    @Column(nullable = false)
    private String endDate;

    @Column(nullable = false)
    private StatutPlanning statut;

    @ManyToOne
    @JoinColumn(name = "medecin_id")
    private Medecin medecin;

    public PlanningMedecin() {}

    public PlanningMedecin(String startDate, String endDate, StatutPlanning statut, Medecin medecin) {
        this.startDate = startDate;
        this.endDate = endDate;
        this.statut = statut;
        this.medecin = medecin;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public StatutPlanning getStatut() {
        return statut;
    }

    public void setStatut(StatutPlanning statut) {
        this.statut = statut;
    }

    public Medecin getMedecin() {
        return medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }
}

enum StatutPlanning {
    DISPONIBLE,
    INDISPONIBLE
}
