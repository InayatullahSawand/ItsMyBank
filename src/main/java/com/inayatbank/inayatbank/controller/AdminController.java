package com.inayatbank.inayatbank.controller;

import com.inayatbank.inayatbank.dto.ApiResponse;
import com.inayatbank.inayatbank.service.AdminService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired private AdminService adminService;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse> dashboard() {
        return ResponseEntity.ok(adminService.getDashboard());
    }

    @PutMapping("/block/{userId}")
    public ResponseEntity<ApiResponse> block(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.blockUser(userId, true));
    }

    @PutMapping("/unblock/{userId}")
    public ResponseEntity<ApiResponse> unblock(@PathVariable Long userId) {
        return ResponseEntity.ok(adminService.blockUser(userId, false));
    }

    @GetMapping("/transactions")
    public ResponseEntity<ApiResponse> transactions() {
        return ResponseEntity.ok(adminService.getAllTransactions());
    }

    @GetMapping("/fraud-alerts")
    public ResponseEntity<ApiResponse> fraudAlerts() {
        return ResponseEntity.ok(adminService.getFraudAlerts());
    }
}