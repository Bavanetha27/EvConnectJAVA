package com.evconnect.api.ui;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.UUID;

/**
 * Pure User/Attendee flow.
 * Note: This test expects that at least one event exists in the system 
 * (Created by OrganizerFlowSeleniumTest or manual creation).
 */
public class UserFlowSeleniumTest extends BaseSeleniumTest {

    private String generateUniqueUser() {
        return "user_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateUniqueEmail() {
        return "email_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    }

    @Test
    void testFullUserAttendeeJourney() {
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "UserPass123!";

        System.out.println("[TEST] Starting Pure User-Attendee Journey...");

        // 1. Register as USER
        driver.get(baseUrl + "/register");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username"))).sendKeys(username);
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 2. Login
        wait.until(ExpectedConditions.urlContains("/login"));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email"))).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 3. Navigate to Events
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        System.out.println("[TEST] Navigating to Events to find existing data...");
        driver.get(baseUrl + "/events");

        // 4. Register for the first existing event
        // Wait for event cards to load (this expects OrganizerFlow has run)
        wait.until(ExpectedConditions.presenceOfElementLocated(By.className("group")));
        
        // Find the "Explore Details" link for any existing event
        WebElement firstEventLink = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//a[contains(., 'Explore Details')]")));
        firstEventLink.click();

        // 5. Click "Secure Ticket"
        wait.until(ExpectedConditions.urlContains("/events/"));
        System.out.println("[TEST] Attempting registration for pre-existing event...");
        WebElement registerButton = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Secure Ticket')]")));
        registerButton.click();

        // 6. Verify "Registered" status
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(., 'Registered')]")));
        Assertions.assertTrue(driver.getPageSource().contains("Registered"), "Should display Registered status after clicking Secure Ticket");
        
        System.out.println("[TEST] Pure User flow completed successfully.");
    }
}
