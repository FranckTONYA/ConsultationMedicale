package org.projet.consultationmedicalebackend.services.impl;

import org.projet.consultationmedicalebackend.modeles.Notification;
import org.projet.consultationmedicalebackend.modeles.Utilisateur;
import org.projet.consultationmedicalebackend.repositories.NotificationRepository;
import org.projet.consultationmedicalebackend.repositories.UtilisateurRepository;
import org.projet.consultationmedicalebackend.services.NotificationService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final UtilisateurRepository utilisateurRepository;

    public NotificationServiceImpl(NotificationRepository notificationRepository, UtilisateurRepository utilisateurRepository) {
        this.notificationRepository = notificationRepository;
        this.utilisateurRepository = utilisateurRepository;
    }

    @Override
    public Notification save(Notification notification) {
        return notificationRepository.save(notification);
    }

    @Override
    public List<Notification> findAll() {
        return notificationRepository.findAll();
    }

    @Override
    public List<Notification> findByUtilisateur(Long utilisateurId) {
        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId).orElse(null);
        return notificationRepository.findByUtilisateur(utilisateur);
    }

    @Override
    public void marquerCommeLu(Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            n.setLu(true);
            notificationRepository.save(n);
        });
    }

    @Override
    public void delete(Long id) {
        notificationRepository.deleteById(id);
    }
}
