package com.inayatbank.inayatbank.service;

import com.inayatbank.inayatbank.dto.*;
import com.inayatbank.inayatbank.model.*;
import com.inayatbank.inayatbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AccountService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private CardRepository cardRepository;

    public ApiResponse getUserAccounts(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail("User not found");

        List<Account> accounts = accountRepository.findByUser(user);
        return ApiResponse.ok("Accounts fetched", accounts);
    }

    public ApiResponse getBalance(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        Map<String, Object> data = new HashMap<>();
        data.put("accountNumber", account.getAccountNumber());
        data.put("accountType", account.getAccountType());
        data.put("balance", account.getBalance());
        data.put("frozen", account.isFrozen());
        return ApiResponse.ok("Balance fetched", data);
    }

    @Transactional
    public ApiResponse deposit(DepositRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");
        if (account.isFrozen()) return ApiResponse.fail("Account is frozen");

        if (request.getAmount() == null || request.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            return ApiResponse.fail("Invalid amount");
        }

        account.setBalance(account.getBalance().add(request.getAmount()));
        accountRepository.save(account);

        Transaction tx = new Transaction();
        tx.setType("DEPOSIT");
        tx.setAmount(request.getAmount());
        tx.setDescription("Test Mode Deposit");
        tx.setStatus("SUCCESS");
        tx.setToAccount(account);
        transactionRepository.save(tx);

        return ApiResponse.ok("Deposit successful (Test Mode)", account);
    }

    @Transactional
    public ApiResponse transfer(TransferRequest request) {
        Account from = accountRepository.findByAccountNumber(request.getFromAccountNumber()).orElse(null);
        Account to = accountRepository.findByAccountNumber(request.getToAccountNumber()).orElse(null);

        if (from == null || to == null) return ApiResponse.fail("Invalid account number");
        if (from.isFrozen() || to.isFrozen()) return ApiResponse.fail("One of the accounts is frozen");
        if (from.getBalance().compareTo(request.getAmount()) < 0) return ApiResponse.fail("Insufficient balance");
        if (request.getAmount().compareTo(BigDecimal.ZERO) <= 0) return ApiResponse.fail("Invalid amount");

        from.setBalance(from.getBalance().subtract(request.getAmount()));
        to.setBalance(to.getBalance().add(request.getAmount()));
        accountRepository.save(from);
        accountRepository.save(to);

        Transaction tx = new Transaction();
        tx.setType("TRANSFER");
        tx.setAmount(request.getAmount());
        tx.setDescription(request.getDescription() != null ? request.getDescription() : "Fund Transfer");
        tx.setStatus("SUCCESS");
        tx.setFromAccount(from);
        tx.setToAccount(to);
        transactionRepository.save(tx);

        return ApiResponse.ok("Transfer successful", tx);
    }

    @Transactional
    public ApiResponse freezeAccount(String accountNumber, boolean freeze) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        account.setFrozen(freeze);
        accountRepository.save(account);

        // Also freeze/unfreeze card
        cardRepository.findByAccount(account).ifPresent(card -> {
            card.setFrozen(freeze);
            cardRepository.save(card);
        });

        String msg = freeze ? "Account & Card frozen successfully" : "Account & Card unfrozen successfully";
        return ApiResponse.ok(msg, account);
    }

    public ApiResponse getCard(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        Card card = cardRepository.findByAccount(account).orElse(null);
        if (card == null) return ApiResponse.fail("Card not found");

        return ApiResponse.ok("Card details", card);
    }

    public ApiResponse getTransactions(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        List<Transaction> list = transactionRepository
                .findByFromAccountOrToAccountOrderByCreatedAtDesc(account, account);
        return ApiResponse.ok("Transactions fetched", list);
    }
}