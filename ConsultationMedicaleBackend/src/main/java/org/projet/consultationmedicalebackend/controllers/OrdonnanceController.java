package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Ordonnance;
import org.projet.consultationmedicalebackend.services.OrdonnanceService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/ordonnance")
@CrossOrigin(origins = "*")
public class OrdonnanceController {

    private final OrdonnanceService ordonnanceService;

    public OrdonnanceController(OrdonnanceService ordonnanceService) {
        this.ordonnanceService = ordonnanceService;
    }

    @GetMapping("/getAll")
    public List<Ordonnance> getAll() {
        return ordonnanceService.findAll();
    }

    @GetMapping("/{id}")
    public Optional<Ordonnance> getById(@PathVariable Long id) {
        return ordonnanceService.findById(id);
    }

    @GetMapping("/find-by-patient/{patientId}")
    public List<Ordonnance> getByPatient(@PathVariable Long patientId) {
        return ordonnanceService.findByPatient(patientId);
    }

    @PostMapping
    public Ordonnance create(@RequestBody Ordonnance ordonnance) {
        return ordonnanceService.save(ordonnance);
    }

    @PutMapping("/update/{id}")
    public Ordonnance update(@PathVariable Long id, @RequestBody Ordonnance ordonnance) {
        ordonnance.setId(id);
        return ordonnanceService.save(ordonnance);
    }

    @DeleteMapping("/delete-by-id/{id}")
    public void delete(@PathVariable Long id) {
        ordonnanceService.delete(id);
    }
}
