package com.openclassrooms.starterjwt.controllersTest;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.openclassrooms.starterjwt.controllers.SessionController;
import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.SessionService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

class SessionControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SessionService sessionService;

    @Mock
    private SessionMapper sessionMapper;

    @InjectMocks
    private SessionController sessionController;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private Date date;
    @BeforeEach
    void setUp() throws ParseException {

        objectMapper.registerModule(new JavaTimeModule());
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(sessionController).build();
        // Initialiser la date pour les tests
        String dateString = "2025-03-03";
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        date = formatter.parse(dateString);
    }

    @Test
    void shouldReturnSession_whenSessionExists() throws Exception {
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        User user = new User(1L, "john.doe@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());
        Session session = new Session(1L, "Session Test", date, "Test session description", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now());
        SessionDto sessionDto = new SessionDto(1L, "Session Test", date, 1L, "Test session description", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now());

        when(sessionService.getById(1L)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(get("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Session Test"))
                .andExpect(jsonPath("$.description").value("Test session description"))
                .andExpect(jsonPath("$.teacher_id").value(1));

        verify(sessionService, times(1)).getById(1L);
        verify(sessionMapper, times(1)).toDto(session);
    }

    @Test
    void shouldReturn404_whenSessionNotFound() throws Exception {
        when(sessionService.getById(2L)).thenReturn(null);

        mockMvc.perform(get("/api/session/2")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isNotFound());

        verify(sessionService, times(1)).getById(2L);
    }

    @Test
    void shouldReturn400_whenIdIsInvalid() throws Exception {
        mockMvc.perform(get("/api/session/abc")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest());

        verify(sessionService, never()).getById(anyLong());
    }

    @Test
    void shouldReturnAllSessions() throws Exception {
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        User user = new User(1L, "john.doe@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());
        List<Session> sessions = Arrays.asList(
                new Session(1L, "Session 1", date, "Description 1", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now()),
                new Session(2L, "Session 2", date, "Description 2", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now())
        );

        List<SessionDto> sessionDtos = Arrays.asList(
                new SessionDto(1L, "Session 1", date, 1L, "Description 1", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now()),
                new SessionDto(2L, "Session 2", date, 1L, "Description 2", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now())
        );

        when(sessionService.findAll()).thenReturn(sessions);
        when(sessionMapper.toDto(sessions)).thenReturn(sessionDtos);

        mockMvc.perform(get("/api/session")
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2));

        verify(sessionService, times(1)).findAll();
    }

    @Test
    void shouldCreateSession() throws Exception {
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        User user = new User(1L, "john.doe@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());
        SessionDto sessionDto = new SessionDto(null, "New Session", date, 1L, "New session description", Arrays.asList(user.getId()), LocalDateTime.now(), LocalDateTime.now());
        Session session = new Session(1L, "New Session", date, "New session description", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now());

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.create(session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(post("/api/session")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("New Session"))
                .andExpect(jsonPath("$.description").value("New session description"))
                .andExpect(jsonPath("$.teacher_id").value(1));

        verify(sessionService, times(1)).create(session);
    }

    @Test
    void shouldUpdateSession() throws Exception {
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        User user = new User(1L, "john.doe@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());
        SessionDto sessionDto = new SessionDto(1L, "Updated Session", date, 1L, "Updated session description", Arrays.asList(1L), LocalDateTime.now(), LocalDateTime.now());
        Session session = new Session(1L, "Updated Session", date, "Updated session description", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now());

        when(sessionMapper.toEntity(sessionDto)).thenReturn(session);
        when(sessionService.update(1L, session)).thenReturn(session);
        when(sessionMapper.toDto(session)).thenReturn(sessionDto);

        mockMvc.perform(put("/api/session/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(sessionDto)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Session"))
                .andExpect(jsonPath("$.description").value("Updated session description"))
                .andExpect(jsonPath("$.teacher_id").value(1));

        verify(sessionService, times(1)).update(1L, session);
    }

    @Test
    void shouldDeleteSession_whenSessionExists() throws Exception {
        Teacher teacher = new Teacher(1L, "John", "Doe", LocalDateTime.now(), LocalDateTime.now());
        User user = new User(1L, "john.doe@example.com", "John", "Doe", "password", true, LocalDateTime.now(), LocalDateTime.now());
        Session session = new Session(1L, "Session to delete", date, "Description to delete", teacher, Arrays.asList(user), LocalDateTime.now(), LocalDateTime.now());
        when(sessionService.getById(1L)).thenReturn(session);

        mockMvc.perform(delete("/api/session/1"))
                .andExpect(status().isOk());

        verify(sessionService, times(1)).delete(1L);
    }

    @Test
    void shouldReturn404_whenDeletingNonExistentSession() throws Exception {
        when(sessionService.getById(99L)).thenReturn(null);

        mockMvc.perform(delete("/api/session/99"))
                .andExpect(status().isNotFound());

        verify(sessionService, never()).delete(anyLong());
    }

    @Test
    void shouldAllowUserToParticipate() throws Exception {
        mockMvc.perform(post("/api/session/1/participate/100"))
                .andExpect(status().isOk());

        verify(sessionService, times(1)).participate(1L, 100L);
    }

    @Test
    void shouldAllowUserToLeaveSession() throws Exception {
        mockMvc.perform(delete("/api/session/1/participate/100"))
                .andExpect(status().isOk());

        verify(sessionService, times(1)).noLongerParticipate(1L, 100L);
    }
}