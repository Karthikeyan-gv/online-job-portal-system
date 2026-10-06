package com.example.jobportal.util;

import com.example.jobportal.exception.InvalidFileException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.UUID;

@Component
public class FileStorageUtil {

    @Value("${app.upload.dir:uploads}")
    private String uploadDir;

    public String storeFile(MultipartFile file, String subDir) {
        if (file.isEmpty()) {
            throw new InvalidFileException("Failed to store empty file.");
        }

        try {
            Path targetDir = Paths.get(uploadDir, subDir);
            if (!Files.exists(targetDir)) {
                Files.createDirectories(targetDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String storedFileName = UUID.randomUUID().toString() + extension;
            Path destinationFile = targetDir.resolve(Paths.get(storedFileName)).normalize().toAbsolutePath();

            Files.copy(file.getInputStream(), destinationFile, StandardCopyOption.REPLACE_EXISTING);

            return subDir + "/" + storedFileName;
        } catch (IOException e) {
            throw new InvalidFileException("Could not store file. Error: " + e.getMessage());
        }
    }
}
