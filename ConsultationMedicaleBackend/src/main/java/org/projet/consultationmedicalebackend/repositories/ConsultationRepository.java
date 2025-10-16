package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.Consultation;
import org.projet.consultationmedicalebackend.modeles.Medecin;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConsultationRepository extends JpaRepository<Consultation, Long> {
    List<Consultation> findByPatient(Patient patient);
    List<Consultation> findByMedecin(Medecin medecin);
}
