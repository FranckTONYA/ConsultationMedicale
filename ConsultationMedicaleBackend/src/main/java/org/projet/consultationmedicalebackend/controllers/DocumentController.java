package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Document;
import org.projet.consultationmedicalebackend.services.DocumentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/document")
@CrossOrigin(origins = "*")
public class DocumentController {

    private final DocumentService documentService;

    public DocumentController(DocumentService documentService) {
        this.documentService = documentService;
    }

    @GetMapping("/getAll")
    public List<Document> getAll() {
        return documentService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Document> getById(@PathVariable Long id) {
        return documentService.findById(id);
    }

    @GetMapping("/find-by-consultation/{consultationId}")
    public List<Document> getByConsultation(@PathVariable Long consultationId) {
        return documentService.findByConsultation(consultationId);
    }

    @PostMapping
    public Document create(@RequestBody Document document) {
        return documentService.save(document);
    }

    @PutMapping("/update/{id}")
    public Document update(@PathVariable Long id, @RequestBody Document document) {
        document.setId(id);
        return documentService.save(document);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public void delete(@PathVariable Long id) {
        documentService.delete(id);
    }
}
