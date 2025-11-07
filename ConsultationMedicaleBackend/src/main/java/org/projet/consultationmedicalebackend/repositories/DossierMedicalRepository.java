package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.models.*;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient(Patient patient);

    @Query("SELECT d FROM DossierMedical d WHERE (d.patient.medecin.id = :m ) ")
    List<DossierMedical> findbyMedecin(@Param("m") Long medecinId);
}
