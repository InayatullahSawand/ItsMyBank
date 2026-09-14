package com.inayatbank.inayatbank.repository;

import com.inayatbank.inayatbank.model.Account;
import com.inayatbank.inayatbank.model.Card;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CardRepository extends JpaRepository<Card, Long> {
    Optional<Card> findByAccount(Account account);
    Optional<Card> findByCardNumber(String cardNumber);
}