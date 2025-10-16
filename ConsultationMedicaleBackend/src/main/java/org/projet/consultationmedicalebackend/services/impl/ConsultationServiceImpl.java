package org.projet.consultationmedicalebackend.services.impl;

import org.projet.consultationmedicalebackend.modeles.Consultation;
import org.projet.consultationmedicalebackend.modeles.Medecin;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.projet.consultationmedicalebackend.repositories.ConsultationRepository;
import org.projet.consultationmedicalebackend.repositories.MedecinRepository;
import org.projet.consultationmedicalebackend.repositories.PatientRepository;
import org.projet.consultationmedicalebackend.services.ConsultationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ConsultationServiceImpl implements ConsultationService {

    private final ConsultationRepository consultationRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;

    public ConsultationServiceImpl(ConsultationRepository consultationRepository, PatientRepository patientRepository, MedecinRepository medecinRepository) {
        this.consultationRepository = consultationRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
    }

    @Override
    public Consultation save(Consultation consultation) {
        return consultationRepository.save(consultation);
    }

    @Override
    public List<Consultation> findAll() {
        return consultationRepository.findAll();
    }

    @Override
    public Optional<Consultation> findById(Long id) {
        return consultationRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        consultationRepository.deleteById(id);
    }

    @Override
    public List<Consultation> findByPatient(Long patientId) {
        Patient patient = patientRepository.findById(patientId).orElse(null);
        return consultationRepository.findByPatient(patient);
    }

    @Override
    public List<Consultation> findByMedecin(Long medecinId) {
        Medecin medecin = medecinRepository.findById(medecinId).orElse(null);
        return consultationRepository.findByMedecin(medecin);
    }
}
