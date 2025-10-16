package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.modeles.Notification;
import java.util.List;

public interface NotificationService {
    Notification save(Notification notification);
    List<Notification> findAll();
    List<Notification> findByUtilisateur(Long utilisateurId);
    void marquerCommeLu(Long id);
    void delete(Long id);
}
