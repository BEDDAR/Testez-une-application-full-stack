package com.openclassrooms.starterjwt.securityTest;

import com.openclassrooms.starterjwt.security.jwt.AuthTokenFilter;
import com.openclassrooms.starterjwt.security.jwt.JwtUtils;
import com.openclassrooms.starterjwt.security.services.UserDetailsServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.util.ReflectionTestUtils;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import java.io.IOException;

import static org.mockito.Mockito.*;

class AuthTokenFilterTest {

    @Mock private JwtUtils jwtUtils;
    @Mock private UserDetailsServiceImpl userDetailsService;
    @Mock private UserDetails userDetails;
    @Mock private FilterChain filterChain;

    private AuthTokenFilter authTokenFilter;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authTokenFilter = new AuthTokenFilter();

        // ⬇️ Inject mocks into private fields
        ReflectionTestUtils.setField(authTokenFilter, "jwtUtils", jwtUtils);
        ReflectionTestUtils.setField(authTokenFilter, "userDetailsService", userDetailsService);
    }

    @Test
    void testDoFilter_validToken() throws ServletException, IOException {
        // Arrange
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.addHeader("Authorization", "Bearer valid.jwt.token");
        MockHttpServletResponse response = new MockHttpServletResponse();

        when(jwtUtils.validateJwtToken("valid.jwt.token")).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken("valid.jwt.token")).thenReturn("testuser");
        when(userDetailsService.loadUserByUsername("testuser")).thenReturn(userDetails);
        when(userDetails.getAuthorities()).thenReturn(null);

        // Act
        authTokenFilter.doFilter(request, response, filterChain); // Appelle doFilterInternal() indirectement

        // Assert
        verify(filterChain).doFilter(request, response);
    }

}
