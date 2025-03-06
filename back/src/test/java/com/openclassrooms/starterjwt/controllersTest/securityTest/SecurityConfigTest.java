package com.openclassrooms.starterjwt.controllersTest.securityTest;
import com.openclassrooms.starterjwt.security.WebSecurityConfig;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@Import(WebSecurityConfig.class) // Assurez-vous d'importer la configuration de sécurité
public class SecurityConfigTest {

    @Autowired
    private WebApplicationContext webApplicationContext;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        // Initialiser MockMvc
        mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
    }

    @Test
    @WithMockUser(username = "testuser", roles = "USER")  // Utilisation de @WithMockUser pour simuler un utilisateur
    void shouldAllowAccessToPrivateUrlsWithAuthentication() throws Exception {
        // Tester l'accès à une URL protégée avec un utilisateur authentifié
        mockMvc.perform(get("/api/session"))
                .andExpect(status().isOk()); // Vérifier que la réponse est 200 OK
    }

}
