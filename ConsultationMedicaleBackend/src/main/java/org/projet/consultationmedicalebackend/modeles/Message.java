package org.projet.consultationmedicalebackend.modeles;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "MESSAGE")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String contenu;

    @Column(nullable = false)
    private boolean lu = false;

    @Column(nullable = false)
    private LocalDateTime dateEnvoi;

    @ManyToOne
    @JoinColumn(name = "emetteur_id")
    private Utilisateur emetteur;

    @ManyToOne
    @JoinColumn(name = "recepteur_id")
    private Utilisateur recepteur;

    public Message() {
    }

    public Message(String contenu, boolean lu, LocalDateTime dateEnvoi, Utilisateur emetteur, Utilisateur recepteur) {
        this.contenu = contenu;
        this.lu = lu;
        this.dateEnvoi = dateEnvoi;
        this.emetteur = emetteur;
        this.recepteur = recepteur;
    }

    public Long getId() {
        return id;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public boolean isLu() {
        return lu;
    }

    public void setLu(boolean lu) {
        this.lu = lu;
    }

    public LocalDateTime getDateEnvoi() {
        return dateEnvoi;
    }

    public void setDateEnvoi(LocalDateTime dateEnvoi) {
        this.dateEnvoi = dateEnvoi;
    }

    public Utilisateur getEmetteur() {
        return emetteur;
    }

    public void setEmetteur(Utilisateur emetteur) {
        this.emetteur = emetteur;
    }

    public Utilisateur getRecepteur() {
        return recepteur;
    }

    public void setRecepteur(Utilisateur recepteur) {
        this.recepteur = recepteur;
    }
}
