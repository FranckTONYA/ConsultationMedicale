package org.projet.consultationmedicalebackend.controllers;

import org.projet.consultationmedicalebackend.models.Message;
import org.projet.consultationmedicalebackend.services.MessageService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/message")
@CrossOrigin(origins = "*")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @GetMapping("/getAll")
    public List<Message> getAll() {
        return messageService.findAll();
    }

    @GetMapping("/find-by-id/{id}")
    public Optional<Message> getById(@PathVariable Long id) {
        return messageService.findById(id);
    }

    @GetMapping("/conversation/{emetteurId}/{recepteurId}")
    public List<Message> getConversation(@PathVariable Long emetteurId, @PathVariable Long recepteurId) {
        return messageService.findConversation(emetteurId, recepteurId);
    }

    @PostMapping
    public Message create(@RequestBody Message message) {
        return messageService.save(message);
    }

    @PutMapping("/{id}")
    public Message update(@PathVariable Long id, @RequestBody Message message) {
        message.setId(id);
        return messageService.save(message);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        messageService.delete(id);
    }
}
