package org.projet.consultationmedicalebackend.controllers;


import org.projet.consultationmedicalebackend.models.Administrateur;
import org.projet.consultationmedicalebackend.models.Medecin;
import org.projet.consultationmedicalebackend.models.Patient;
import org.projet.consultationmedicalebackend.models.RoleUtilisateur;
import org.projet.consultationmedicalebackend.services.AuthenticationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthenticationController {
    private final AuthenticationService authenticationService;

    public AuthenticationController(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(@RequestBody Patient patient) {
        String token = authenticationService.registerPatient(patient);
        return ResponseEntity.ok(Map.of("token", token, "role", RoleUtilisateur.PATIENT.name()));
    }

    @PostMapping("/register/medecin")
    public ResponseEntity<?> registerMedecin(@RequestBody Medecin medecin) {
        String token = authenticationService.registerMedecin(medecin);
        return ResponseEntity.ok(Map.of("token", token, "role",  RoleUtilisateur.MEDECIN.name()));
    }

    @PostMapping("/register/admin")
    public ResponseEntity<?> registerAdmin(@RequestBody Administrateur administrateur) {
        String token = authenticationService.registerAdmin(administrateur);
        return ResponseEntity.ok(Map.of("token", token, "role",  RoleUtilisateur.ADMINISTRATEUR.name()));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        String motDePasse = request.get("motDePasse");

        Optional<String> token = authenticationService.login(email, motDePasse);
        if (token.isPresent()) {
            return ResponseEntity.ok(Map.of("token", token.get()));
        } else {
            return ResponseEntity.status(401).body(Map.of("error", "Email ou mot de passe incorrect"));
        }
    }
}
