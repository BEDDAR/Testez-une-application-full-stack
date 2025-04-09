package com.openclassrooms.starterjwt.payloadTest;

import com.openclassrooms.starterjwt.payload.request.SignupRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import javax.validation.*;
import java.util.Set;

import static org.junit.jupiter.api.Assertions.*;

public class SignupRequestTest {

    private Validator validator;

    @BeforeEach
    void setUp() {
        ValidatorFactory factory = Validation.buildDefaultValidatorFactory();
        validator = factory.getValidator();
    }

    @Test
    void testValidSignupRequest() {
        SignupRequest request = new SignupRequest();
        request.setEmail("test@example.com");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("strongPassword");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(request);
        assertTrue(violations.isEmpty(), "Expected no validation errors");
    }

    @Test
    void testInvalidEmail() {
        SignupRequest request = new SignupRequest();
        request.setEmail("invalid-email");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setPassword("strongPassword");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(request);
        assertFalse(violations.isEmpty());
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
    }

    @Test
    void testBlankFields() {
        SignupRequest request = new SignupRequest();
        request.setEmail("");
        request.setFirstName("");
        request.setLastName("");
        request.setPassword("");

        Set<ConstraintViolation<SignupRequest>> violations = validator.validate(request);
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("email")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("firstName")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("lastName")));
        assertTrue(violations.stream().anyMatch(v -> v.getPropertyPath().toString().equals("password")));

    }
}