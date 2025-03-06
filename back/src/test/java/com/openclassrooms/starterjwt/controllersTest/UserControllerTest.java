package com.openclassrooms.starterjwt.controllersTest;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.UserController;
import com.openclassrooms.starterjwt.dto.UserDto;
import com.openclassrooms.starterjwt.mapper.UserMapper;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeEach;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.time.LocalDateTime;
import java.util.ArrayList;

@WithMockUser(username = "john.doe@example.com")
class UserControllerTest {

    private MockMvc mockMvc;

    @Mock
    private UserService userService;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(userController).build();

            // Simuler un contexte de sécurité valide
            SecurityContext securityContext = mock(SecurityContext.class);
            Authentication authentication = mock(Authentication.class);

            when(securityContext.getAuthentication()).thenReturn(authentication);
            when(authentication.getPrincipal()).thenReturn(new org.springframework.security.core.userdetails.User(
                    "john.doe@example.com", "password", new ArrayList<>()));


            SecurityContextHolder.setContext(securityContext);

    }

    @Test
    void shouldReturnUser_whenUserExists() throws Exception {
        // GIVEN : Un utilisateur valide
        User user = new User("john.doe@example.com", "John", "Doe", "password",true);
        UserDto userDto = new UserDto(1L, "john.doe@example.com","John", "Doe",true,"password",LocalDateTime.of(2025, 3, 3, 0, 0),LocalDateTime.of(2025, 3, 3, 0, 0));

        when(userService.findById(1L)).thenReturn(user);
        when(userMapper.toDto(user)).thenReturn(userDto);

        // WHEN & THEN : Effectuer une requête GET et vérifier la réponse
        mockMvc.perform(get("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Vérifie que le statut est 200
                .andExpect(jsonPath("$.id").value(1))  // Vérifie que l'ID est correct
                .andExpect(jsonPath("$.firstName").value("Doe"))
                .andExpect(jsonPath("$.lastName").value("John"))
                .andExpect(jsonPath("$.email").value("john.doe@example.com"));

        verify(userService, times(1)).findById(1L);
        verify(userMapper, times(1)).toDto(user);
    }

    @Test
    void shouldReturn404_whenUserNotFound() throws Exception {
        // GIVEN : Aucun utilisateur trouvé pour cet ID
        when(userService.findById(2L)).thenReturn(null);

        // WHEN & THEN : Effectuer une requête GET et vérifier la réponse
        mockMvc.perform(get("/api/user/2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound()); // Vérifie que le statut est 404

        verify(userService, times(1)).findById(2L);
    }

    @Test
    void shouldReturn400_whenIdIsInvalid() throws Exception {
        // WHEN & THEN : Tester un ID invalide (ex: "abc")
        mockMvc.perform(get("/api/user/abc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest()); // Vérifie que le statut est 400

        verify(userService, never()).findById(anyLong()); // Vérifie que le service n'est pas appelé
    }

    @Test
    @WithMockUser(username = "john.doe@example.com") // Simule un utilisateur connecté
    void shouldDeleteUser_whenAuthorized() throws Exception {
        // GIVEN : Un utilisateur existant
        User user = new User("john.doe@example.com", "John", "Doe", "password", true);
        when(userService.findById(1L)).thenReturn(user);

        // WHEN & THEN : Suppression réussie
        mockMvc.perform(delete("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk()); // Vérifie que la réponse est 200 OK

        verify(userService, times(1)).findById(1L);
        verify(userService, times(1)).delete(1L);
    }

    @Test
    void shouldReturn401_whenUserNotAuthorized() throws Exception {
        // GIVEN : L'utilisateur authentifié n'est pas celui à supprimer
        User user = new User("john.doe@example.com", "John", "Doe", "password", true);
        when(userService.findById(1L)).thenReturn(user);

        // Simuler un utilisateur connecté avec un e-mail différent
        SecurityContext securityContext = SecurityContextHolder.createEmptyContext();
        Authentication authentication = mock(Authentication.class);

        when(authentication.getPrincipal()).thenReturn(new org.springframework.security.core.userdetails.User(
                "unauthorized@example.com", "password", new ArrayList<>()
        ));

        when(authentication.getName()).thenReturn("unauthorized@example.com");
        when(authentication.isAuthenticated()).thenReturn(true);

        securityContext.setAuthentication(authentication);
        SecurityContextHolder.setContext(securityContext);

        // WHEN & THEN : Vérifier que la suppression est refusée (401 Unauthorized)
        mockMvc.perform(delete("/api/user/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isUnauthorized()); // Vérifie que l'accès est interdit

        verify(userService, times(1)).findById(1L);
        verify(userService, never()).delete(anyLong()); // Vérifie que delete() n'a pas été appelé
    }

}
