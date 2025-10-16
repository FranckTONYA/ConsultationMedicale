package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.Document;
import org.projet.consultationmedicalebackend.modeles.Consultation;
import org.projet.consultationmedicalebackend.modeles.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByConsultation(Consultation consultation);

}
