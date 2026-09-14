package com.inayatbank.inayatbank.controller;

import com.inayatbank.inayatbank.dto.*;
import com.inayatbank.inayatbank.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
@CrossOrigin(origins = "*")
public class AccountController {

    @Autowired
    private AccountService accountService;

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse> getUserAccounts(@PathVariable Long userId) {
        return ResponseEntity.ok(accountService.getUserAccounts(userId));
    }

    @GetMapping("/balance/{accountNumber}")
    public ResponseEntity<ApiResponse> getBalance(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getBalance(accountNumber));
    }

    @PostMapping("/deposit")
    public ResponseEntity<ApiResponse> deposit(@RequestBody DepositRequest request) {
        return ResponseEntity.ok(accountService.deposit(request));
    }

    @PostMapping("/transfer")
    public ResponseEntity<ApiResponse> transfer(@RequestBody TransferRequest request) {
        return ResponseEntity.ok(accountService.transfer(request));
    }

    @PutMapping("/freeze/{accountNumber}")
    public ResponseEntity<ApiResponse> freeze(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.freezeAccount(accountNumber, true));
    }

    @PutMapping("/unfreeze/{accountNumber}")
    public ResponseEntity<ApiResponse> unfreeze(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.freezeAccount(accountNumber, false));
    }

    @GetMapping("/card/{accountNumber}")
    public ResponseEntity<ApiResponse> getCard(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getCard(accountNumber));
    }

    @GetMapping("/transactions/{accountNumber}")
    public ResponseEntity<ApiResponse> getTransactions(@PathVariable String accountNumber) {
        return ResponseEntity.ok(accountService.getTransactions(accountNumber));
    }
}