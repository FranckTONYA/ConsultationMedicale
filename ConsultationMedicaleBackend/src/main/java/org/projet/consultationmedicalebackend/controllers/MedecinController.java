package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Medecin;
import org.projet.consultationmedicalebackend.services.MedecinService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/medecin")
@CrossOrigin(origins = "*")
public class MedecinController {

    private final MedecinService medecinService;

    public MedecinController(MedecinService medecinService) {
        this.medecinService = medecinService;
    }

    @GetMapping("/getAll")
    public List<Medecin> getAll() {
        return medecinService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Medecin> getById(@PathVariable Long id) {
        return medecinService.findById(id);
    }

    @GetMapping("/find-by-email/{email}")
    public Optional<Medecin> getByEmail(@PathVariable String email) {
        return medecinService.findByEmail(email);
    }

    @GetMapping("find-by-inami/{inami}")
    public Optional<Medecin> getInami(@PathVariable String inami) {
        return medecinService.findByInami(inami);
    }

    @GetMapping("/find-by-specialite/{specialite}")
    public List<Medecin> getBySpecialite(@PathVariable String specialite) {
        return medecinService.findBySpecialite(specialite);
    }

    @PostMapping
    public Medecin create(@RequestBody Medecin medecin) {
        return medecinService.save(medecin);
    }

    @PutMapping("/update/{id}")
    public Medecin update(@PathVariable Long id, @RequestBody Medecin medecin) {
        medecin.setId(id);
        return medecinService.save(medecin);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public void delete(@PathVariable Long id) {
        medecinService.delete(id);
    }

    @PostMapping("/assign-patient")
    public ResponseEntity<?> assignPatientToMedecin(@RequestBody Map<String, Long> ids) {
        Long medecinId = ids.get("medecinId");
        Long patientId = ids.get("patientId");
        medecinService.assignPatientToMedecin(medecinId, patientId);
        return ResponseEntity.ok("Patient assigné au médecin");
    }

    @DeleteMapping("/remove-patient/{medecinId}/{patientId}")
    public ResponseEntity<?> removePatientFromMedecin(@PathVariable Long medecinId, @PathVariable Long patientId) {
        medecinService.removePatientFromMedecin(medecinId, patientId);
        return ResponseEntity.ok("Patient désassigné du médecin");
    }
}
