package com.evconnect.api.ui;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.ui.ExpectedConditions;

import java.util.UUID;

public class AdminFlowSeleniumTest extends BaseSeleniumTest {

    private String generateUniqueUser() {
        return "admin_" + UUID.randomUUID().toString().substring(0, 8);
    }

    private String generateUniqueEmail() {
        return "admin_" + UUID.randomUUID().toString().substring(0, 8) + "@evconnect.com";
    }

    @Test
    void testAdminManagementFlow() {
        String username = generateUniqueUser();
        String email = generateUniqueEmail();
        String password = "AdminPass123!";

        // 1. Admin Enrollment (Register as ADMIN)
        driver.get(baseUrl + "/admin/signup");
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("username"))).sendKeys(username);
        driver.findElement(By.name("email")).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.name("confirmPassword")).sendKeys(password);
        
        driver.findElement(By.xpath("//button[contains(., 'Register as Administrator')]")).click();

        // 2. Admin Login
        wait.until(ExpectedConditions.urlContains("/admin/login"));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.name("email"))).sendKeys(email);
        driver.findElement(By.name("password")).sendKeys(password);
        driver.findElement(By.xpath("//button[contains(., 'Authenticate')]")).click();

        // 3. Verify Admin Control Panel Access
        wait.until(ExpectedConditions.urlContains("/admin"));
        WebElement header = wait.until(ExpectedConditions.visibilityOfElementLocated(By.xpath("//h1[contains(text(), 'Admin Control Panel')]")));
        Assertions.assertTrue(header.isDisplayed(), "The admin dashboard header should be visible");
        
        // 4. Verify Global Statistics
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(., 'Total Events')]")));
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//p[contains(., 'Global Users')]")));
        
        // 5. Navigate through tabs
        WebElement manageEventsTab = driver.findElement(By.xpath("//button[contains(., 'Manage Events')]"));
        manageEventsTab.click();
        
        // 6. Verify Event Identity table
        wait.until(ExpectedConditions.presenceOfElementLocated(By.xpath("//th[contains(., 'Event Identity')]")));
        Assertions.assertTrue(driver.getCurrentUrl().contains("/admin"), "Should still be in the admin portal");
    }
}
