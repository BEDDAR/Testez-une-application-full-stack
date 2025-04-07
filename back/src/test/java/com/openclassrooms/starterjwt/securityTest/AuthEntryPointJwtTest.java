package com.openclassrooms.starterjwt.securityTest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.security.jwt.AuthEntryPointJwt;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;

import javax.servlet.ServletOutputStream;
import javax.servlet.WriteListener;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class AuthEntryPointJwtTest {

    @Test
    void testCommence_shouldReturnUnauthorizedJsonResponse() throws Exception {
        // Arrange
        AuthEntryPointJwt authEntryPointJwt = new AuthEntryPointJwt();

        HttpServletRequest mockRequest = mock(HttpServletRequest.class);
        HttpServletResponse mockResponse = mock(HttpServletResponse.class);
        AuthenticationException mockException = mock(AuthenticationException.class);

        when(mockRequest.getServletPath()).thenReturn("/api/test");
        when(mockException.getMessage()).thenReturn("Unauthorized access");

        // Simuler ServletOutputStream
        ByteArrayOutputStream byteStream = new ByteArrayOutputStream();
        ServletOutputStream servletOutputStream = new ServletOutputStream() {
            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(WriteListener listener) {
                // Pas nécessaire pour ce test
            }

            @Override
            public void write(int b) throws IOException {
                byteStream.write(b);
            }
        };
        when(mockResponse.getOutputStream()).thenReturn(servletOutputStream);

        // Act
        authEntryPointJwt.commence(mockRequest, mockResponse, mockException);

        // Assert
        verify(mockResponse).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(mockResponse).setStatus(HttpServletResponse.SC_UNAUTHORIZED);

        // Vérifie le contenu JSON
        String responseJson = byteStream.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(responseJson, Map.class);

        assertEquals(401, responseMap.get("status"));
        assertEquals("Unauthorized", responseMap.get("error"));
        assertEquals("Unauthorized access", responseMap.get("message"));
        assertEquals("/api/test", responseMap.get("path"));
    }
}