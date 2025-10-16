package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.DossierMedical;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface DossierMedicalRepository extends JpaRepository<DossierMedical, Long> {
    Optional<DossierMedical> findByPatient(Patient patient);
}
