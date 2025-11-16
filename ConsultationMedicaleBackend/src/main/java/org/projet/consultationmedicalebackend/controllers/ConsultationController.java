package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Consultation;
import org.projet.consultationmedicalebackend.services.ConsultationService;
import org.projet.consultationmedicalebackend.utils.CustomResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/consultation")
@CrossOrigin(origins = "*")
public class ConsultationController {

    @Autowired
    private ConsultationService consultationService;

//    @PostMapping
//    public ResponseEntity<Consultation> creerConsultation(@RequestBody Consultation consultation) {
//        Consultation nouvelle = consultationService.save(consultation);
//        return ResponseEntity.ok(nouvelle);
//    }

    @PostMapping
    public ResponseEntity<?> creerConsultation(@RequestBody Consultation consultation) {
        CustomResponse response = consultationService.createConsultation(consultation);
        if (response.status)
            return ResponseEntity.ok(Map.of("message", response.message));
        else
            return ResponseEntity.badRequest().body(Map.of("error", response.message));
    }

    @GetMapping("/getAll")
    public ResponseEntity<List<Consultation>> getAllConsultations() {
        List<Consultation> consultations = consultationService.findAll();
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Consultation> getConsultationById(@PathVariable Long id) {
        Optional<Consultation> consultation = consultationService.findById(id);
        return consultation.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/find-by-patient/{idPatient}")
    public ResponseEntity<List<Consultation>> getConsultationsByPatient(@PathVariable Long idPatient) {
        List<Consultation> consultations = consultationService.findByPatient(idPatient);
        return ResponseEntity.ok(consultations);
    }

    @GetMapping("/find-by-medecin/{idMedecin}")
    public ResponseEntity<List<Consultation>> getConsultationsByMedecin(@PathVariable Long idMedecin) {
        List<Consultation> consultations = consultationService.findByMedecin(idMedecin);
        return ResponseEntity.ok(consultations);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Consultation> updateConsultation(@PathVariable Long id, @RequestBody Consultation consultation) {
        consultation.setId(id);
        Consultation result = consultationService.save(consultation);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public ResponseEntity<Void> deleteConsultation(@PathVariable Long id) {
        consultationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
