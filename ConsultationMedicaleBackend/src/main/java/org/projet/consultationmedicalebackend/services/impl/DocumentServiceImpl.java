package org.projet.consultationmedicalebackend.services.impl;

import org.projet.consultationmedicalebackend.models.Consultation;
import org.projet.consultationmedicalebackend.models.Document;
import org.projet.consultationmedicalebackend.repositories.ConsultationRepository;
import org.projet.consultationmedicalebackend.repositories.DocumentRepository;
import org.projet.consultationmedicalebackend.services.DocumentService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository documentRepository;
    private final ConsultationRepository consultationRepository;

    public DocumentServiceImpl(DocumentRepository documentRepository, ConsultationRepository consultationRepository) {
        this.documentRepository = documentRepository;
        this.consultationRepository = consultationRepository;
    }

    @Override
    public Document save(Document document) {
        return documentRepository.save(document);
    }

    @Override
    public List<Document> findAll() {
        return documentRepository.findAll();
    }

    @Override
    public Optional<Document> findById(Long id) {
        return documentRepository.findById(id);
    }

    @Override
    public List<Document> findByConsultation(Long consultationId) {
        Consultation consultation = consultationRepository.findById(consultationId).orElse(null);
        return documentRepository.findByConsultation(consultation);
    }

    @Override
    public void delete(Long id) {
        documentRepository.deleteById(id);
    }
}
