package org.projet.consultationmedicalebackend.repositories;

import org.projet.consultationmedicalebackend.modeles.Message;
import org.projet.consultationmedicalebackend.modeles.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
    List<Message> findByEmetteur(Utilisateur emetteur);
    List<Message> findByRecepteur(Utilisateur recepteur);
}
