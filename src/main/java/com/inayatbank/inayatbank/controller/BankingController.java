package com.inayatbank.inayatbank.controller;

import com.inayatbank.inayatbank.dto.*;
import com.inayatbank.inayatbank.service.BankingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/banking")
@CrossOrigin(origins = "*")
public class BankingController {

    @Autowired private BankingService bankingService;

    @PostMapping("/bill")
    public ResponseEntity<ApiResponse> payBill(@RequestBody BillRequest request) {
        return ResponseEntity.ok(bankingService.payBill(request));
    }

    @GetMapping("/qr/{accountNumber}")
    public ResponseEntity<ApiResponse> qr(@PathVariable String accountNumber) {
        return ResponseEntity.ok(bankingService.getQRData(accountNumber));
    }

    @PostMapping("/chatbot")
    public ResponseEntity<ApiResponse> chat(@RequestBody ChatRequest request) {
        return ResponseEntity.ok(bankingService.chatbot(request));
    }

    @PostMapping("/reminder")
    public ResponseEntity<ApiResponse> addReminder(@RequestBody ReminderRequest request) {
        return ResponseEntity.ok(bankingService.addReminder(request));
    }

    @GetMapping("/reminders/{userId}")
    public ResponseEntity<ApiResponse> reminders(@PathVariable Long userId) {
        return ResponseEntity.ok(bankingService.getReminders(userId));
    }

    @GetMapping("/expense/{accountNumber}")
    public ResponseEntity<ApiResponse> expense(@PathVariable String accountNumber) {
        return ResponseEntity.ok(bankingService.monthlyExpense(accountNumber));
    }
}