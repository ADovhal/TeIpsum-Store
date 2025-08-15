package com.teipsum.adminproductservice.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.api.io.TempDir;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("ImageService Tests")
class ImageServiceTest {

    private ImageService imageService;

    @TempDir
    Path tempDir;

    private String baseUrl;
    private UUID testProductId;
    private List<MultipartFile> testImages;

    @BeforeEach
    void setUp() {
        imageService = new ImageService();
        baseUrl = "http://localhost:8080/images";
        testProductId = UUID.randomUUID();

        // Set private fields using ReflectionTestUtils
        ReflectionTestUtils.setField(imageService, "baseDir", tempDir.toString());
        ReflectionTestUtils.setField(imageService, "baseUrl", baseUrl);

        testImages = List.of(
                new MockMultipartFile("image1", "image1.jpg", "image/jpeg", "test image 1 content".getBytes()),
                new MockMultipartFile("image2", "image2.jpg", "image/jpeg", "test image 2 content".getBytes()),
                new MockMultipartFile("image3", "image3.jpg", "image/jpeg", "test image 3 content".getBytes())
        );
    }

    @Test
    @DisplayName("Should upload images successfully")
    void shouldUploadImagesSuccessfully() throws IOException {
        // When
        List<String> urls = imageService.uploadImages(testProductId, testImages);

        // Then
        assertNotNull(urls);
        assertEquals(3, urls.size());

        // Verify URLs are correctly formatted
        assertEquals(baseUrl + "/" + testProductId + "/img1.jpg", urls.get(0));
        assertEquals(baseUrl + "/" + testProductId + "/img2.jpg", urls.get(1));
        assertEquals(baseUrl + "/" + testProductId + "/img3.jpg", urls.get(2));

        // Verify files were created on disk
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertTrue(Files.exists(productDir));
        assertTrue(Files.exists(productDir.resolve("img1.jpg")));
        assertTrue(Files.exists(productDir.resolve("img2.jpg")));
        assertTrue(Files.exists(productDir.resolve("img3.jpg")));

        // Verify file contents
        assertEquals("test image 1 content", Files.readString(productDir.resolve("img1.jpg")));
        assertEquals("test image 2 content", Files.readString(productDir.resolve("img2.jpg")));
        assertEquals("test image 3 content", Files.readString(productDir.resolve("img3.jpg")));
    }

    @Test
    @DisplayName("Should return empty list when no images provided")
    void shouldReturnEmptyListWhenNoImagesProvided() throws IOException {
        // When
        List<String> urls = imageService.uploadImages(testProductId, null);

        // Then
        assertNotNull(urls);
        assertTrue(urls.isEmpty());

        // Verify no directory was created
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertFalse(Files.exists(productDir));
    }

    @Test
    @DisplayName("Should return empty list when empty image list provided")
    void shouldReturnEmptyListWhenEmptyImageListProvided() throws IOException {
        // When
        List<String> urls = imageService.uploadImages(testProductId, List.of());

        // Then
        assertNotNull(urls);
        assertTrue(urls.isEmpty());

        // Verify no directory was created
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertFalse(Files.exists(productDir));
    }

    @Test
    @DisplayName("Should create product directory if it doesn't exist")
    void shouldCreateProductDirectoryIfItDoesntExist() throws IOException {
        // Given
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertFalse(Files.exists(productDir));

        // When
        imageService.uploadImages(testProductId, testImages.subList(0, 1));

        // Then
        assertTrue(Files.exists(productDir));
        assertTrue(Files.isDirectory(productDir));
    }

    @Test
    @DisplayName("Should handle single image upload")
    void shouldHandleSingleImageUpload() throws IOException {
        // Given
        List<MultipartFile> singleImage = List.of(
                new MockMultipartFile("image", "single.jpg", "image/jpeg", "single image content".getBytes())
        );

        // When
        List<String> urls = imageService.uploadImages(testProductId, singleImage);

        // Then
        assertNotNull(urls);
        assertEquals(1, urls.size());
        assertEquals(baseUrl + "/" + testProductId + "/img1.jpg", urls.get(0));

        // Verify file was created
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        Path imageFile = productDir.resolve("img1.jpg");
        assertTrue(Files.exists(imageFile));
        assertEquals("single image content", Files.readString(imageFile));
    }

    @Test
    @DisplayName("Should delete images successfully")
    void shouldDeleteImagesSuccessfully() throws IOException {
        // Given - create some files first
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        Files.createDirectories(productDir);
        Files.write(productDir.resolve("img1.jpg"), "content1".getBytes());
        Files.write(productDir.resolve("img2.jpg"), "content2".getBytes());
        Files.write(productDir.resolve("img3.jpg"), "content3".getBytes());

        assertTrue(Files.exists(productDir));
        assertEquals(3, Files.list(productDir).count());

        // When
        imageService.deleteImages(testProductId);

        // Then
        assertFalse(Files.exists(productDir));
    }

    @Test
    @DisplayName("Should handle deletion of non-existent directory")
    void shouldHandleDeletionOfNonExistentDirectory() throws IOException {
        // Given
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertFalse(Files.exists(productDir));

        // When & Then - should not throw exception
        assertDoesNotThrow(() -> imageService.deleteImages(testProductId));
    }

    @Test
    @DisplayName("Should delete nested directory structure")
    void shouldDeleteNestedDirectoryStructure() throws IOException {
        // Given - create nested structure
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        Path subDir = productDir.resolve("subdirectory");
        Files.createDirectories(subDir);
        Files.write(productDir.resolve("img1.jpg"), "content1".getBytes());
        Files.write(subDir.resolve("nested.jpg"), "nested content".getBytes());

        assertTrue(Files.exists(productDir));
        assertTrue(Files.exists(subDir));

        // When
        imageService.deleteImages(testProductId);

        // Then
        assertFalse(Files.exists(productDir));
        assertFalse(Files.exists(subDir));
    }

    @Test
    @DisplayName("Should overwrite existing images")
    void shouldOverwriteExistingImages() throws IOException {
        // Given - create existing images
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        Files.createDirectories(productDir);
        Files.write(productDir.resolve("img1.jpg"), "old content".getBytes());

        // When - upload new images
        List<MultipartFile> newImages = List.of(
                new MockMultipartFile("image", "new.jpg", "image/jpeg", "new content".getBytes())
        );
        List<String> urls = imageService.uploadImages(testProductId, newImages);

        // Then
        assertNotNull(urls);
        assertEquals(1, urls.size());

        // Verify old content was overwritten
        Path imageFile = productDir.resolve("img1.jpg");
        assertTrue(Files.exists(imageFile));
        assertEquals("new content", Files.readString(imageFile));
    }

    @Test
    @DisplayName("Should handle large number of images")
    void shouldHandleLargeNumberOfImages() throws IOException {
        // Given - create many images
        List<MultipartFile> manyImages = List.of(
                new MockMultipartFile("image1", "1.jpg", "image/jpeg", "content1".getBytes()),
                new MockMultipartFile("image2", "2.jpg", "image/jpeg", "content2".getBytes()),
                new MockMultipartFile("image3", "3.jpg", "image/jpeg", "content3".getBytes()),
                new MockMultipartFile("image4", "4.jpg", "image/jpeg", "content4".getBytes()),
                new MockMultipartFile("image5", "5.jpg", "image/jpeg", "content5".getBytes()),
                new MockMultipartFile("image6", "6.jpg", "image/jpeg", "content6".getBytes()),
                new MockMultipartFile("image7", "7.jpg", "image/jpeg", "content7".getBytes()),
                new MockMultipartFile("image8", "8.jpg", "image/jpeg", "content8".getBytes()),
                new MockMultipartFile("image9", "9.jpg", "image/jpeg", "content9".getBytes()),
                new MockMultipartFile("image10", "10.jpg", "image/jpeg", "content10".getBytes())
        );

        // When
        List<String> urls = imageService.uploadImages(testProductId, manyImages);

        // Then
        assertNotNull(urls);
        assertEquals(10, urls.size());

        // Verify all files were created with correct naming
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        for (int i = 1; i <= 10; i++) {
            Path imageFile = productDir.resolve("img" + i + ".jpg");
            assertTrue(Files.exists(imageFile));
            assertEquals("content" + i, Files.readString(imageFile));
            assertEquals(baseUrl + "/" + testProductId + "/img" + i + ".jpg", urls.get(i - 1));
        }
    }

    @Test
    @DisplayName("Should handle images with different content types")
    void shouldHandleImagesWithDifferentContentTypes() throws IOException {
        // Given
        List<MultipartFile> mixedImages = List.of(
                new MockMultipartFile("image1", "image1.png", "image/png", "png content".getBytes()),
                new MockMultipartFile("image2", "image2.gif", "image/gif", "gif content".getBytes()),
                new MockMultipartFile("image3", "image3.webp", "image/webp", "webp content".getBytes())
        );

        // When
        List<String> urls = imageService.uploadImages(testProductId, mixedImages);

        // Then
        assertNotNull(urls);
        assertEquals(3, urls.size());

        // All files should be saved as .jpg regardless of original type
        assertEquals(baseUrl + "/" + testProductId + "/img1.jpg", urls.get(0));
        assertEquals(baseUrl + "/" + testProductId + "/img2.jpg", urls.get(1));
        assertEquals(baseUrl + "/" + testProductId + "/img3.jpg", urls.get(2));

        // Verify files exist and contain correct content
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        assertEquals("png content", Files.readString(productDir.resolve("img1.jpg")));
        assertEquals("gif content", Files.readString(productDir.resolve("img2.jpg")));
        assertEquals("webp content", Files.readString(productDir.resolve("img3.jpg")));
    }

    @Test
    @DisplayName("Should handle empty file content")
    void shouldHandleEmptyFileContent() throws IOException {
        // Given
        List<MultipartFile> emptyImages = List.of(
                new MockMultipartFile("image", "empty.jpg", "image/jpeg", new byte[0])
        );

        // When
        List<String> urls = imageService.uploadImages(testProductId, emptyImages);

        // Then
        assertNotNull(urls);
        assertEquals(1, urls.size());

        // Verify empty file was created
        Path productDir = Paths.get(tempDir.toString(), testProductId.toString());
        Path imageFile = productDir.resolve("img1.jpg");
        assertTrue(Files.exists(imageFile));
        assertEquals(0, Files.size(imageFile));
    }
}
