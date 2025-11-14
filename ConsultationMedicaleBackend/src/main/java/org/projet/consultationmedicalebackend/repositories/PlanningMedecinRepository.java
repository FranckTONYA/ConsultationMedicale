package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.models.PlanningMedecin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlanningMedecinRepository extends JpaRepository<PlanningMedecin, Long> {

    List<PlanningMedecin> findPlanningMedecinsByMedecin_Id(Long medecinId);
}
