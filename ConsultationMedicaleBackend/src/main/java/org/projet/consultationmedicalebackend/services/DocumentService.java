package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Document;

import java.util.List;
import java.util.Optional;

public interface DocumentService {
    Document save(Document document);
    List<Document> findAll();
    Optional<Document> findById(Long id);
    List<Document> findByConsultation(Long consultationId);
    void delete(Long id);
}
