package com.dovhal.userservice.event;

import com.dovhal.userservice.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import com.dovhal.shared.event.UserLoggedInEvent;
import com.dovhal.shared.event.UserRegisteredEvent;

@Component
@RequiredArgsConstructor
public class UserEventListener {

    private final UserService userService;

    @KafkaListener(
            topics = "user-registered",
            groupId = "user-service-group"
    )
    public void handleUserRegistration(UserRegisteredEvent event) {
        userService.createUserProfile(
                event.userId(),
                event.email(),
                event.name(),
                event.surname(),
                event.phone(),
                event.dob()
        );
    }

    @KafkaListener(
            topics = "user-login",
            groupId = "user-service-group"
    )
    public void handleUserLogin(UserLoggedInEvent event) {
        userService.updateLastLogin(
                event.email(), 
                event.timestamp()
        );
    }
}