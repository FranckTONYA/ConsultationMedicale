package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.models.Message;
import org.projet.consultationmedicalebackend.models.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByEmetteur(Utilisateur emetteur);
    List<Message> findByRecepteur(Utilisateur recepteur);

    @Query("SELECT m FROM Message m WHERE (m.emetteur = :e) AND (m.recepteur = :r) ")
    List<Message> findConversation(@Param("e") Utilisateur emetteur, @Param("r")Utilisateur recepteur);
}
