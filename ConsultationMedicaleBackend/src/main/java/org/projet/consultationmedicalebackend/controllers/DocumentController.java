package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Consultation;
import org.projet.consultationmedicalebackend.models.Document;
import org.projet.consultationmedicalebackend.models.TypeDoc;
import org.projet.consultationmedicalebackend.services.ConsultationService;
import org.projet.consultationmedicalebackend.services.DocumentService;
import org.projet.consultationmedicalebackend.services.FileStorageService;
import org.projet.consultationmedicalebackend.utils.CustomResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/document")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private ConsultationService consultationService;

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

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDoc(@PathVariable Long id) {
        CustomResponse customResponse = new CustomResponse();
        Optional<Document> documentOpt =  documentService.findById(id);
        if(documentOpt.isPresent()) {

            File f = new File(System.getProperty("user.dir") + "/uploads-consultations/" + documentOpt.get().getUrlStockage());
            if (f.exists()) f.delete();

            documentService.delete(id);
            customResponse.status = true;
            customResponse.message ="Document supprimé";
            return ResponseEntity.ok( Map.of("message", customResponse.message));
        }else {
            customResponse.status = false;
            customResponse.message = "Document introuvable";
            return ResponseEntity.ok(Map.of("error", customResponse.message));
        }
    }

    @PostMapping("/upload/{consultationId}")
    public ResponseEntity<?> uploadFiles(
            @PathVariable Long consultationId,
            @RequestParam("files") List<MultipartFile> files) {
        Optional<Consultation> consultationOpt = consultationService.findById(consultationId);
        if (consultationOpt.isEmpty())
            return  ResponseEntity.badRequest().body(Map.of("error", "Consultation non trouvée"));

        CustomResponse customResponse = documentService.uploadConsultationFiles(files, consultationOpt.get());
        if(customResponse.status)
            return ResponseEntity.ok(Map.of("message", customResponse.message));
        else
            return ResponseEntity.badRequest().body(Map.of("error", customResponse.message));
    }


    @GetMapping("/file/{fileName}")
    public ResponseEntity<Resource> getFile(@PathVariable String fileName) {
        try {
            File file = new File(System.getProperty("user.dir") + "/uploads-consultations/" + fileName);

            if (!file.exists()) {
                return ResponseEntity.notFound().build();
            }

            Path path = file.toPath();
            Resource resource = new UrlResource(path.toUri());

            // Détection automatique du type MIME
            String contentType = Files.probeContentType(path);
            if (contentType == null) {
                contentType = "application/octet-stream"; // fallback
            }

            return ResponseEntity.ok()
                    .header("Content-Disposition", "inline; filename=\"" + fileName + "\"")
                    .header("Content-Type", contentType)
                    .body(resource);

        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }


}
