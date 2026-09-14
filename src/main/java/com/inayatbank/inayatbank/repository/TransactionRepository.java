package com.inayatbank.inayatbank.repository;

import com.inayatbank.inayatbank.model.Account;
import com.inayatbank.inayatbank.model.Transaction;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {
    List<Transaction> findByFromAccountOrToAccountOrderByCreatedAtDesc(Account from, Account to);
    List<Transaction> findByFromAccountOrderByCreatedAtDesc(Account account);
}