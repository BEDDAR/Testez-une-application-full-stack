package com.openclassrooms.starterjwt.securityTest;

import static org.junit.jupiter.api.Assertions.*;

import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.Authentication;
import org.springframework.test.context.TestPropertySource;

@SpringBootTest
@TestPropertySource(properties = {
        "oc.app.jwtSecret=mySecretKey",         // Valeur simulée pour le secret
        "oc.app.jwtExpirationMs=3600000"        // Valeur simulée pour l'expiration du token
})
public class JwtUtilsTest {

    @Autowired
    private JwtUtils jwtUtils;

    @Test
    void testGenerateJwtToken() {
        // Arrange: Créer un UserDetailsImpl simulé
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.getUsername()).thenReturn("rebiha@example.com");

        // Créer un Authentication simulé
        Authentication authentication = Mockito.mock(Authentication.class);
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);

        // Act: Générer un token JWT
        String token = jwtUtils.generateJwtToken(authentication);

        // Assert: Vérifier que le token généré n'est pas null
        assertNotNull(token);
        // Tu peux aussi ajouter plus de vérifications en fonction de la logique de ton application
    }

    @Test
    void testGetUserNameFromJwtToken() {
        // Arrange: Créer un token avec un nom d'utilisateur
        Authentication authentication = Mockito.mock(Authentication.class);
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.getUsername()).thenReturn("rebiha@example.com");
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);
        String token = jwtUtils.generateJwtToken(authentication);

        // Act: Extraire le nom d'utilisateur du token
        String username = jwtUtils.getUserNameFromJwtToken(token);

        // Assert: Vérifier que le nom d'utilisateur extrait est correct
        assertEquals("rebiha@example.com", username);
    }

    @Test
    void testValidateJwtToken() {
        // Créer un UserDetailsImpl simulé avec un nom d'utilisateur valide
        UserDetailsImpl userDetails = Mockito.mock(UserDetailsImpl.class);
        Mockito.when(userDetails.getUsername()).thenReturn("rebiha@example.com");

        // Créer un Authentication simulé avec l'UserDetails
        Authentication authentication = Mockito.mock(Authentication.class);
        Mockito.when(authentication.getPrincipal()).thenReturn(userDetails);

        // Générer un token JWT valide
        String token = jwtUtils.generateJwtToken(authentication);

        // Vérifier si le token est valide
        boolean isValid = jwtUtils.validateJwtToken(token);

        // Vérifier que le token est valide
        assertTrue(isValid);
    }


    @Test
    void testValidateInvalidJwtToken() {
        // Arrange: Créer un token invalide (par exemple un token avec un mauvais secret)
        String invalidToken = "invalidToken";

        // Act: Vérifier si le token est valide
        boolean isValid = jwtUtils.validateJwtToken(invalidToken);

        // Assert: Vérifier que le token est invalide
        assertFalse(isValid);
    }
}
