package com.openclassrooms.starterjwt.payloadTest;

import com.openclassrooms.starterjwt.payload.response.MessageResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MessageResponseTest {

    @Test
    void testConstructorAndGetMessage() {
        String msg = "Test message";
        MessageResponse response = new MessageResponse(msg);

        assertEquals(msg, response.getMessage());
    }

    @Test
    void testSetMessage() {
        MessageResponse response = new MessageResponse("Initial message");
        String newMessage = "Updated message";

        response.setMessage(newMessage);

        assertEquals(newMessage, response.getMessage());
    }
}