package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Patient;

import java.util.List;
import java.util.Optional;

public interface PatientService {
    Patient save(Patient patient);
    List<Patient> findAll();
    Optional<Patient> findById(Long id);
    Optional<Patient> findByNiss(String niss);
    void delete(Long id);
}
