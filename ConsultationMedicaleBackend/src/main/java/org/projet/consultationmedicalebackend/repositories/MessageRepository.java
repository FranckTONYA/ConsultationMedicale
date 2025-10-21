package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.models.Message;
import org.projet.consultationmedicalebackend.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByEmetteur(Utilisateur emetteur);
    List<Message> findByRecepteur(Utilisateur recepteur);
    List<Message> findConversation(Utilisateur emetteur, Utilisateur recepteur);
}
