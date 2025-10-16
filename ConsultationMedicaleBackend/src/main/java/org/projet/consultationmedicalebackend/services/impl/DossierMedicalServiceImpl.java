package org.projet.consultationmedicalebackend.services.impl;

import org.projet.consultationmedicalebackend.modeles.DossierMedical;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.projet.consultationmedicalebackend.repositories.DossierMedicalRepository;
import org.projet.consultationmedicalebackend.repositories.PatientRepository;
import org.projet.consultationmedicalebackend.services.DossierMedicalService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DossierMedicalServiceImpl implements DossierMedicalService {

    private final DossierMedicalRepository dossierMedicalRepository;
    private final PatientRepository patientRepository;

    public DossierMedicalServiceImpl(DossierMedicalRepository dossierMedicalRepository, PatientRepository patientRepository) {
        this.dossierMedicalRepository = dossierMedicalRepository;
        this.patientRepository = patientRepository;
    }

    @Override
    public DossierMedical save(DossierMedical dossierMedical) {
        return dossierMedicalRepository.save(dossierMedical);
    }

    @Override
    public List<DossierMedical> findAll() {
        return dossierMedicalRepository.findAll();
    }

    @Override
    public Optional<DossierMedical> findById(Long id) {
        return dossierMedicalRepository.findById(id);
    }

    @Override
    public Optional<DossierMedical> findByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        return dossierMedicalRepository.findByPatient(patient);
    }

    @Override
    public void delete(Long id) {
        dossierMedicalRepository.deleteById(id);
    }
}
