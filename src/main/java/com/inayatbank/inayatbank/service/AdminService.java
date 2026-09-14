package com.inayatbank.inayatbank.service;

import com.inayatbank.inayatbank.dto.ApiResponse;
import com.inayatbank.inayatbank.model.*;
import com.inayatbank.inayatbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;

@Service
public class AdminService {

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;

    public ApiResponse getDashboard() {
        List<User> users = userRepository.findAll();
        List<Account> accounts = accountRepository.findAll();
        List<Transaction> transactions = transactionRepository.findAll();

        BigDecimal totalBalance = accounts.stream()
                .map(Account::getBalance)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        Map<String, Object> data = new HashMap<>();
        data.put("totalUsers", users.size());
        data.put("totalAccounts", accounts.size());
        data.put("totalBalance", totalBalance);
        data.put("totalTransactions", transactions.size());
        data.put("users", users);
        data.put("recentTransactions", transactions.size() > 10
                ? transactions.subList(transactions.size() - 10, transactions.size())
                : transactions);

        return ApiResponse.ok("Admin dashboard", data);
    }

    public ApiResponse blockUser(Long userId, boolean block) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail("User not found");
        user.setEnabled(!block);
        userRepository.save(user);
        return ApiResponse.ok(block ? "User blocked" : "User unblocked", user);
    }

    public ApiResponse getAllTransactions() {
        return ApiResponse.ok("All transactions", transactionRepository.findAll());
    }

    public ApiResponse getFraudAlerts() {
        List<Transaction> all = transactionRepository.findAll();
        List<Transaction> alerts = new ArrayList<>();
        for (Transaction t : all) {
            if (t.getAmount() != null && t.getAmount().compareTo(new BigDecimal("50000")) >= 0) {
                alerts.add(t);
            }
        }
        return ApiResponse.ok("Fraud alerts (amount >= 50000)", alerts);
    }
}