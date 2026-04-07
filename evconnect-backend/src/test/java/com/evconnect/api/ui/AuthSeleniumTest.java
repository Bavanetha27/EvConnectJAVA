package com.evconnect.api.ui;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.UUID;

public class AuthSeleniumTest extends BaseSeleniumTest {

    private String generateUniqueUser() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateUniqueEmail() {
        return "email_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    }

    private void registerUser(String username, String email, String password) {
        driver.get(baseUrl + "/register");
        
        WebElement usernameInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username")));
        usernameInput.sendKeys(username);
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        
        WebElement submitButton = driver.findElement(By.cssSelector("button[type='submit']"));
        submitButton.click();
        
        // Wait for redirect to login page after registration
        wait.until(ExpectedConditions.urlContains("/login"));
    }

    @Test
    void testLoginFlow() {
        // Register a user first to ensure credentials exist
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "Password123!";
        registerUser(username, email, password);

        // Now attempt to login
        driver.get(baseUrl + "/login");
        WebElement emailInput = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email")));
        emailInput.sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // Verify redirect to dashboard
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/dashboard"), "Should redirect to dashboard after login");
    }

    @Test
    void testRegistrationFlow() {
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "SecurePass123!";
        
        registerUser(username, email, password);

        // Verification is handled by registerUser helper (waiting for /login)
        Assertions.assertTrue(driver.getCurrentUrl().contains("/login"), "Should navigate to login after successful registration");
    }

    @Test
    void testFullUserJourney() {
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "JourneyPass123!";

        // 1. Register
        registerUser(username, email, password);
        Assertions.assertTrue(driver.getCurrentUrl().contains("/login"));

        // 2. Login
        WebElement loginEmail = wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email")));
        loginEmail.sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 3. Dashboard
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/dashboard"), "Should arrive at dashboard after registration and login");
    }

    @Test
    void testNavigateToRegisterFromLogin() {
        driver.get(baseUrl + "/login");
        
        // Find the "Sign up for free" link
        WebElement registerLink = wait.until(ExpectedConditions.elementToBeClickable(By.partialLinkText("Sign up")));
        registerLink.click();
        
        // Verify we are on register page
        wait.until(ExpectedConditions.urlContains("/register"));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/register"), "Should navigate to register page when clicking the sign up link");
    }
}
