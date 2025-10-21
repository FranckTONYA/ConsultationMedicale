package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.models.*;
import org.projet.consultationmedicalebackend.repositories.*;
import org.projet.consultationmedicalebackend.security.CustomUserDetails;
import org.projet.consultationmedicalebackend.security.jwt.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthenticationService {

    private final UtilisateurRepository utilisateurRepository;
    private final PatientRepository patientRepository;
    private final MedecinRepository medecinRepository;
    private final AdministrateurRepository administrateurRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthenticationService(UtilisateurRepository utilisateurRepository,
                                 PatientRepository patientRepository,
                                 MedecinRepository medecinRepository,
                                 AdministrateurRepository administrateurRepository,
                                 PasswordEncoder passwordEncoder,
                                 JwtService jwtService) {
        this.utilisateurRepository = utilisateurRepository;
        this.patientRepository = patientRepository;
        this.medecinRepository = medecinRepository;
        this.administrateurRepository = administrateurRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    public String registerPatient(Patient patient) {
        patient.setMotDePasse(passwordEncoder.encode(patient.getMotDePasse()));
        patient.setRole(RoleUtilisateur.PATIENT);
        patientRepository.save(patient);
        CustomUserDetails userDetails = new CustomUserDetails(patient);
        return jwtService.generateToken(userDetails);
    }

    public String registerMedecin(Medecin medecin) {
        medecin.setMotDePasse(passwordEncoder.encode(medecin.getMotDePasse()));
        medecin.setRole(RoleUtilisateur.MEDECIN);
        medecinRepository.save(medecin);
        CustomUserDetails userDetails = new CustomUserDetails(medecin);
        return jwtService.generateToken(userDetails);
    }

    public Optional<String> login(String email, String motDePasse) {
        Optional<Utilisateur> userOpt = utilisateurRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            Utilisateur user = userOpt.get();
            if (passwordEncoder.matches(motDePasse, user.getMotDePasse())) {
                // Crée un CustomUserDetails pour Spring Security
                CustomUserDetails userDetails = new CustomUserDetails(user);
                return Optional.of(jwtService.generateToken(userDetails));
            }
        }
        return Optional.empty();
    }

}
