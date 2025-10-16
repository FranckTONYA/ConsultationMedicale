package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Consultation;
import java.util.List;
import java.util.Optional;

public interface ConsultationService {
    Consultation save(Consultation consultation);
    List<Consultation> findAll();
    Optional<Consultation> findById(Long id);
    void delete(Long id);
    List<Consultation> findByPatient(Long patientId);
    List<Consultation> findByMedecin(Long medecinId);
}
