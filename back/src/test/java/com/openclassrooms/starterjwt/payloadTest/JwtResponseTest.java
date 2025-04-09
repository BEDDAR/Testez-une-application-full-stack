package com.openclassrooms.starterjwt.payloadTest;

import com.openclassrooms.starterjwt.payload.response.JwtResponse;
import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

public class JwtResponseTest {

    @Test
    void testConstructorAndGetters() {
        String token = "test-token";
        Long id = 123L;
        String username = "testuser";
        String firstName = "John";
        String lastName = "Doe";
        Boolean admin = true;

        JwtResponse jwtResponse = new JwtResponse(token, id, username, firstName, lastName, admin);

        assertEquals(token, jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(id, jwtResponse.getId());
        assertEquals(username, jwtResponse.getUsername());
        assertEquals(firstName, jwtResponse.getFirstName());
        assertEquals(lastName, jwtResponse.getLastName());
        assertEquals(admin, jwtResponse.getAdmin());
    }

    @Test
    void testSetters() {
        JwtResponse jwtResponse = new JwtResponse("token", 1L, "user", "fname", "lname", false);

        jwtResponse.setToken("new-token");
        jwtResponse.setType("CustomType");
        jwtResponse.setId(999L);
        jwtResponse.setUsername("newuser");
        jwtResponse.setFirstName("NewFirst");
        jwtResponse.setLastName("NewLast");
        jwtResponse.setAdmin(true);

        assertEquals("new-token", jwtResponse.getToken());
        assertEquals("CustomType", jwtResponse.getType());
        assertEquals(999L, jwtResponse.getId());
        assertEquals("newuser", jwtResponse.getUsername());
        assertEquals("NewFirst", jwtResponse.getFirstName());
        assertEquals("NewLast", jwtResponse.getLastName());
        assertTrue(jwtResponse.getAdmin());
    }
}

