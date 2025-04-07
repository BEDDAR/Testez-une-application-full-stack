package com.openclassrooms.starterjwt.serviceTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.repository.TeacherRepository;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(MockitoExtension.class)  // Extension pour intégrer Mockito avec JUnit5
public class TeacherServiceTest {

    @Mock
    private TeacherRepository teacherRepository;  // Mock du TeacherRepository

    @InjectMocks
    private TeacherService teacherService;  // Service à tester, avec les mocks injectés

    @Test
    public void testFindAll() {
        // Préparer un professeur fictif
        Teacher teacher = new Teacher()
                .setFirstName("John")
                .setLastName("Doe");

        // Simuler le comportement de findAll pour retourner une liste avec un seul professeur
        when(teacherRepository.findAll()).thenReturn(Arrays.asList(teacher));

        // Appeler la méthode findAll du service
        List<Teacher> result = teacherService.findAll();

        // Vérifier les résultats
        assertNotNull(result);  // Assurer que la liste n'est pas nulle
        assertEquals(1, result.size());  // La taille de la liste doit être 1
        assertEquals("John", result.get(0).getFirstName());  // Vérifier que le prénom est correct
    }

    @Test
    public void testFindById() {
        // Créer un professeur fictif
        Teacher teacher = new Teacher()
                .setFirstName("Jane")
                .setLastName("Smith");

        // Simuler le comportement de findById pour retourner un professeur avec un ID spécifique
        when(teacherRepository.findById(1L)).thenReturn(Optional.of(teacher));

        // Appeler la méthode findById du service
        Teacher foundTeacher = teacherService.findById(1L);

        // Vérifier les résultats
        assertNotNull(foundTeacher);  // Assurer que le professeur est trouvé
        assertEquals("Jane", foundTeacher.getFirstName());  // Vérifier le prénom
        assertEquals("Smith", foundTeacher.getLastName());  // Vérifier le nom de famille
    }
}
