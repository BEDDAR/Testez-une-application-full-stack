package com.openclassrooms.starterjwt.mapperTest;

import com.openclassrooms.starterjwt.dto.SessionDto;
import com.openclassrooms.starterjwt.mapper.SessionMapper;
import com.openclassrooms.starterjwt.models.Session;
import com.openclassrooms.starterjwt.models.Teacher;
import com.openclassrooms.starterjwt.models.User;
import com.openclassrooms.starterjwt.services.TeacherService;
import com.openclassrooms.starterjwt.services.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

import java.util.Arrays;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@SpringBootTest
public class SessionMapperTest {

    @Autowired
    private SessionMapper sessionMapper;

    @MockBean
    private UserService userService;

    @MockBean
    private TeacherService teacherService;

    @Test
    void testToEntity_mapsCorrectly() {
        // Arrange
        SessionDto dto = new SessionDto();
        dto.setDescription("My session");
        dto.setTeacher_id(1L);
        dto.setUsers(Arrays.asList(10L, 20L));

        Teacher teacher = new Teacher();
        teacher.setId(1L);

        User user1 = new User();
        user1.setId(10L);
        User user2 = new User();
        user2.setId(20L);

        when(teacherService.findById(1L)).thenReturn(teacher);
        when(userService.findById(10L)).thenReturn(user1);
        when(userService.findById(20L)).thenReturn(user2);

        // Act
        Session session = sessionMapper.toEntity(dto);

        // Assert
        assertNotNull(session);
        assertEquals("My session", session.getDescription());
        assertEquals(teacher, session.getTeacher());
        assertEquals(2, session.getUsers().size());
    }

    @Test
    void testToDto_mapsCorrectly() {
        // Arrange
        Session session = new Session();
        session.setDescription("DTO test");

        Teacher teacher = new Teacher();
        teacher.setId(99L);
        session.setTeacher(teacher);

        User user1 = new User();
        user1.setId(1L);
        User user2 = new User();
        user2.setId(2L);
        session.setUsers(Arrays.asList(user1, user2));

        // Act
        SessionDto dto = sessionMapper.toDto(session);

        // Assert
        assertNotNull(dto);
        assertEquals("DTO test", dto.getDescription());
        assertEquals(99L, dto.getTeacher_id());
        assertEquals(2, dto.getUsers().size());
    }
}