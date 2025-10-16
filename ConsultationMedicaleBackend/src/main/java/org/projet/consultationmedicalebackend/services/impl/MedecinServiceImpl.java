package org.projet.consultationmedicalebackend.services.impl;

import org.projet.consultationmedicalebackend.modeles.Medecin;
import org.projet.consultationmedicalebackend.repositories.MedecinRepository;
import org.projet.consultationmedicalebackend.services.MedecinService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class MedecinServiceImpl implements MedecinService {

    private final MedecinRepository medecinRepository;

    public MedecinServiceImpl(MedecinRepository medecinRepository) {
        this.medecinRepository = medecinRepository;
    }

    @Override
    public Medecin save(Medecin medecin) {
        return medecinRepository.save(medecin);
    }

    @Override
    public List<Medecin> findAll() {
        return medecinRepository.findAll();
    }

    @Override
    public Optional<Medecin> findById(Long id) {
        return medecinRepository.findById(id);
    }

    @Override
    public Optional<Medecin> findByEmail(String email) {
        return medecinRepository.findByEmail(email);
    }

    @Override
    public void delete(Long id) {
        medecinRepository.deleteById(id);
    }
}
