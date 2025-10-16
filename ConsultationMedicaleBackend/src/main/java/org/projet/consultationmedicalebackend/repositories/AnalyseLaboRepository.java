package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.AnalyseLabo;
import org.projet.consultationmedicalebackend.modeles.Medecin;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyseLaboRepository extends JpaRepository<AnalyseLabo, Long> {
    List<AnalyseLabo> findByPatient(Patient patient);
    List<AnalyseLabo> findByMedecin(Medecin medecin);
}
