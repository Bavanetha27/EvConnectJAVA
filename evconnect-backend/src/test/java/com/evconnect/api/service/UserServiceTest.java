package com.evconnect.api.service;

import com.evconnect.api.model.User;
import com.evconnect.api.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id("1")
                .username("testuser")
                .email("test@example.com")
                .password("encodedPassword")
                .role("USER")
                .build();
    }

    @Test
    void findAllUsers_ShouldReturnList() {
        when(userRepository.findAll()).thenReturn(Arrays.asList(testUser));

        List<User> users = userService.findAllUsers();

        assertNotNull(users);
        assertEquals(1, users.size());
        verify(userRepository, times(1)).findAll();
    }

    @Test
    void findUserById_WhenUserExists_ShouldReturnUser() {
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));

        User user = userService.findUserById("1");

        assertNotNull(user);
        assertEquals("testuser", user.getUsername());
    }

    @Test
    void findUserById_WhenUserDoesNotExist_ShouldThrowException() {
        when(userRepository.findById("2")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> userService.findUserById("2"));
    }

    @Test
    void updateProfile_ShouldUpdateAndSave() {
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        User updatedUser = userService.updateProfile("1", "newname", "new@example.com");

        assertNotNull(updatedUser);
        assertEquals("newname", testUser.getUsername());
        assertEquals("new@example.com", testUser.getEmail());
        verify(userRepository).save(testUser);
    }

    @Test
    void changePassword_WhenOldPasswordMatches_ShouldUpdatePassword() {
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("oldPass", "encodedPassword")).thenReturn(true);
        when(passwordEncoder.encode("newPass")).thenReturn("newEncoded");

        userService.changePassword("1", "oldPass", "newPass");

        assertEquals("newEncoded", testUser.getPassword());
        verify(userRepository).save(testUser);
    }

    @Test
    void changePassword_WhenOldPasswordDoesNotMatch_ShouldThrowException() {
        when(userRepository.findById("1")).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("wrongPass", "encodedPassword")).thenReturn(false);

        assertThrows(RuntimeException.class, () -> userService.changePassword("1", "wrongPass", "newPass"));
        verify(userRepository, never()).save(any(User.class));
    }
}
