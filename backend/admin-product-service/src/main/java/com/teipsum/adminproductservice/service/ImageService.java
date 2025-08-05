package com.teipsum.adminproductservice.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;

@Service
public class ImageService {

    @Value("${storage.local-path}")
    private String baseDir;

    @Value("${storage.base-url}")
    private String baseUrl;

    public List<String> uploadImages(UUID productId, List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) return List.of();

        Path dir = Paths.get(baseDir, productId.toString());
        Files.createDirectories(dir);

        List<String> urls = new ArrayList<>();
        int index = 1;
        for (MultipartFile file : files) {
            String fileName = "img" + index++ + ".jpg";
            Path target = dir.resolve(fileName);
            Files.write(target, file.getBytes());
            urls.add(baseUrl + "/" + productId + "/" + fileName);
        }
        return urls;
    }

    public void deleteImages(UUID productId) throws IOException {
        Path dir = Paths.get(baseDir, productId.toString());
        if (Files.exists(dir)) {
            Files.walk(dir)
                    .sorted(Comparator.reverseOrder())
                    .map(Path::toFile)
                    .forEach(java.io.File::delete);
        }
    }
}