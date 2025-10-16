package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Administrateur;

import java.util.List;
import java.util.Optional;

public interface AdministrateurService {
    Administrateur save(Administrateur administrateur);
    List<Administrateur> findAll();
    Optional<Administrateur> findById(Long id);
    Optional<Administrateur> findByEmail(String email);
    void delete(Long id);
}
