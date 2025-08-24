package com.teipsum.userservice;

import com.teipsum.shared.exceptions.handler.GlobalExceptionHandler;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@Import(GlobalExceptionHandler.class)
@ActiveProfiles("test")
class UserServiceApplicationTests {

    @Test
    void contextLoads() {
    }

}
