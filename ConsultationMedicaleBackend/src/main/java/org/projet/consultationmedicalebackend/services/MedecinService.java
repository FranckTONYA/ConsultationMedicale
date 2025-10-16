package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Medecin;
import java.util.List;
import java.util.Optional;

public interface MedecinService {
    Medecin save(Medecin medecin);
    List<Medecin> findAll();
    Optional<Medecin> findById(Long id);
    Optional<Medecin> findByEmail(String email);
    void delete(Long id);
}
