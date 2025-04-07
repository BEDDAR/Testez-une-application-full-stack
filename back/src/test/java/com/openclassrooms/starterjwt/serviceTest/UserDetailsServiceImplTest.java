package com.openclassrooms.starterjwt.serviceTest;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith; // Import pour l'extension Mockito
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension; // Extension pour intégrer Mockito avec JUnit 5
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.repository.UserRepository;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;


@ExtendWith(MockitoExtension.class)  // Intègre Mockito avec JUnit 5
public class UserDetailsServiceImplTest {

    @Mock
    private UserRepository userRepository;  // Mock du repository

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;  // Service à tester avec les mocks injectés

    @Test
    void testLoadUserByUsername_success() {
        // Arrange : préparer un utilisateur fictif
        User user = new User();
        user.setEmail("rebiha@example.com");
        user.setPassword("123456");
        user.setFirstName("Rebiha");
        user.setLastName("Test");

        // Simuler la méthode findByEmail du UserRepository pour renvoyer un utilisateur fictif
        when(userRepository.findByEmail("rebiha@example.com")).thenReturn(java.util.Optional.of(user));

        // Act : appeler la méthode loadUserByUsername
        UserDetails userDetails = this.userDetailsService.loadUserByUsername("rebiha@example.com");

        // Assert : vérifier que l'utilisateur retourné n'est pas nul et que l'email est correct
        assertNotNull(userDetails);
        assertEquals("rebiha@example.com", userDetails.getUsername());
    }

    @Test
    void testLoadUserByUsername_userNotFound() {
        // Simuler la méthode findByEmail pour renvoyer un utilisateur non trouvé (Optional.empty)
        when(userRepository.findByEmail("inconnu@example.com")).thenReturn(java.util.Optional.empty());

        // Act & Assert : vérifier que la méthode lève une exception UsernameNotFoundException
        assertThrows(UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername("inconnu@example.com"));
    }
}