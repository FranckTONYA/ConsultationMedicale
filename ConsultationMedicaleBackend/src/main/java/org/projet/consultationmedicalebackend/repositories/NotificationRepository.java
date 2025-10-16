package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.Notification;
import org.projet.consultationmedicalebackend.modeles.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUtilisateur(Utilisateur utilisateur);
}
