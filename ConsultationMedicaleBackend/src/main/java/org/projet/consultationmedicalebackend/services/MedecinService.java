package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.models.Medecin;
import java.util.List;
import java.util.Optional;

public interface MedecinService {
    Medecin save(Medecin medecin);
    List<Medecin> findAll();
    Optional<Medecin> findById(Long id);
    Optional<Medecin> findByEmail(String email);
    List<Medecin> findBySpecialite(String specialite);
    void delete(Long id);
}
