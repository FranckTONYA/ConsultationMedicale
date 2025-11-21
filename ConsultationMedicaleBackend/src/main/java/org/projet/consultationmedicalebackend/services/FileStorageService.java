package org.projet.consultationmedicalebackend.services;

import org.projet.consultationmedicalebackend.models.Document;
import org.projet.consultationmedicalebackend.models.TypeDoc;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileStorageService {

    private final Path root = Paths.get("uploads");

    public FileStorageService() {
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Impossible de créer le dossier d’upload");
        }
    }

    public String saveFile(MultipartFile file, String folder) throws Exception {

        String uploadDir = System.getProperty("user.dir") + folder;

        Path path = Paths.get(uploadDir);
        if (!Files.exists(path)) {
            Files.createDirectories(path);
        }

        String generatedName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
        Path destination = path.resolve(generatedName);

        file.transferTo(destination.toFile());

        return generatedName; // IMPORTANT !
    }


    public void deleteFile(String filePath) {
        try {
            if (filePath == null) return;

            Path realPath = root.resolve(filePath.replace("/uploads/", ""));
            Files.deleteIfExists(realPath);
        } catch (IOException e) {
            throw new RuntimeException("Erreur suppression fichier : " + e.getMessage());
        }
    }
}
