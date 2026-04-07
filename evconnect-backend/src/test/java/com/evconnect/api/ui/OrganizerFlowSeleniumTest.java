package com.evconnect.api.ui;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;

import java.util.UUID;

public class OrganizerFlowSeleniumTest extends BaseSeleniumTest {

    private String generateUniqueUser() {
        return "org_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateUniqueEmail() {
        return "org_" + UUID.randomUUID().toString().substring(0, 8) + "@test.com";
    }

    @Test
    void testOrganizerEventCreationFlow() {
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "OrgPass123!";
        JavascriptExecutor js = (JavascriptExecutor) driver;

        // 1. Register as ORGANIZER
        driver.get(baseUrl + "/register");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username"))).sendKeys(username);
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        new Select(driver.findElement(By.name("role"))).selectByValue("ORGANIZER");
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 2. Login
        wait.until(ExpectedConditions.urlContains("/login"));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email"))).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.cssSelector("button[type='submit']")).click();

        // 3. Navigate to Organizer Hub
        wait.until(ExpectedConditions.urlContains("/dashboard"));
        WebElement organizerHubTab = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'Organizer Hub')]")));
        organizerHubTab.click();

        // 4. Create New Event
        WebElement newBroadcastBtn = wait.until(ExpectedConditions.elementToBeClickable(By.xpath("//button[contains(., 'New Broadcast')]")));
        newBroadcastBtn.click();

        // 5. Fill Event Form (Segmented Native Date Interaction)
        String eventTitle = "Selenium Event " + UUID.randomUUID().toString().substring(0, 4);
        WebElement titleInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//input[@placeholder='e.g. Global Tech Summit 2026']")));
        titleInput.sendKeys(eventTitle);
        
        // Native interaction with datetime-local picker (Format: DD-MM-YYYY HH:mm)
        WebElement dateInput = driver.findElement(By.xpath("//input[@type='datetime-local']"));
        // Slow segmented entry for reliability
        dateInput.sendKeys("01"); 
        dateInput.sendKeys("05"); 
        dateInput.sendKeys("2026"); 
        dateInput.sendKeys(Keys.TAB);
        dateInput.sendKeys("01");
        dateInput.sendKeys("30");
        
        driver.findElement(By.xpath("//input[@placeholder='e.g. San Francisco, CA']")).sendKeys("Tech Hub, CA");
        new Select(driver.findElement(By.xpath("//select"))).selectByValue("Technology");
        driver.findElement(By.xpath("//textarea")).sendKeys("This event was created by automated Selenium test with final sync hardening.");
        
        // Small pause for React state stabilization
        try { Thread.sleep(500); } catch (InterruptedException ignored) {}

        // 6. Submit Event (Using JS click fallback)
        WebElement submitBtn = driver.findElement(By.xpath("//button[contains(., 'Publish Event Application')]"));
        js.executeScript("arguments[0].click();", submitBtn);

        // 7. Verify Event Published (Broad text-based detection)
        System.out.println("[TEST] Waiting for success toast notification...");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//*[contains(text(), 'Event broadcasted successfully!')]")));
        Assertions.assertTrue(driver.getPageSource().contains("successfully!"), "Success toast should be detected");
        
        // Also verify the event exists in the list
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//div[contains(text(), '" + eventTitle + "')]")));
        Assertions.assertTrue(driver.getPageSource().contains(eventTitle), "The newly created event title should be visible in the list");
    }
}
