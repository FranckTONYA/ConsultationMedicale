package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.models.DossierMedical;
import org.projet.consultationmedicalebackend.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient(Patient patient);
}
