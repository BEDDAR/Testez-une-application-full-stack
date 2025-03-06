package com.openclassrooms.starterjwt.controllersTest;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.openclassrooms.starterjwt.controllers.TeacherController;
import com.openclassrooms.starterjwt.dto.TeacherDto;
import com.openclassrooms.starterjwt.mapper.TeacherMapper;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.services.TeacherService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;

class TeacherControllerTest {

    private MockMvc mockMvc;

    @Mock
    private TeacherService teacherService;

    @Mock
    private TeacherMapper teacherMapper;

    @InjectMocks
    private TeacherController teacherController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(teacherController).build();
    }

    @Test
    void shouldReturnTeacher_whenTeacherExists() throws Exception {
        // GIVEN : Un enseignant valide
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0));

        TeacherDto teacherDto = new TeacherDto(1L, "John", "Doe", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0));

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(teacherMapper.toDto(teacher)).thenReturn(teacherDto);

        // WHEN & THEN : Requête GET et vérification de la réponse
        mockMvc.perform(get("/api/teacher/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Vérifie que le statut est 200 OK
                .andExpect(jsonPath("$.id").value(1))  // Vérifie l'ID
                .andExpect(jsonPath("$.firstName").value("Doe"))
                .andExpect(jsonPath("$.lastName").value("John"));

        verify(teacherService, times(1)).findById(1L);
        verify(teacherMapper, times(1)).toDto(teacher);
    }

    @Test
    void shouldReturn404_whenTeacherNotFound() throws Exception {
        // GIVEN : Aucun enseignant trouvé
        when(teacherService.findById(2L)).thenReturn(null);

        // WHEN & THEN : Vérification que la réponse est 404 Not Found
        mockMvc.perform(get("/api/teacher/2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(teacherService, times(1)).findById(2L);
    }

    @Test
    void shouldReturn400_whenIdIsInvalid() throws Exception {
        // WHEN & THEN : Vérification que la réponse est 400 Bad Request
        mockMvc.perform(get("/api/teacher/abc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verify(teacherService, never()).findById(anyLong()); // Le service ne doit pas être appelé
    }

    @Test
    void shouldReturnAllTeachers() throws Exception {
        // GIVEN : Une liste d'enseignants
        List<Teacher> teachers = Arrays.asList(
                new Teacher(1L, "John", "Doe", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0)),
                new Teacher(2L, "Jane", "Smith", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0))
        );

        List<TeacherDto> teacherDtos = Arrays.asList(
                new TeacherDto(1L, "John", "Doe", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0)),
                new TeacherDto(2L, "Jane", "Smith", LocalDateTime.of(2025, 3, 3, 0, 0), LocalDateTime.of(2025, 3, 3, 0, 0))
        );

        when(teacherService.findAll()).thenReturn(teachers);
        when(teacherMapper.toDto(teachers)).thenReturn(teacherDtos);

        // WHEN & THEN : Vérification que la réponse contient bien les enseignants
        mockMvc.perform(get("/api/teacher")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())  // Vérifie que le statut est 200 OK
                .andExpect(jsonPath("$.length()").value(2))  // Vérifie qu'il y a 2 enseignants
                .andExpect(jsonPath("$[0].firstName").value("Doe"))
                .andExpect(jsonPath("$[1].firstName").value("Smith"));

        verify(teacherService, times(1)).findAll();
        verify(teacherMapper, times(1)).toDto(teachers);
    }
}
