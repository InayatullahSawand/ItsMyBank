package com.inayatbank.inayatbank.repository;

import com.inayatbank.inayatbank.model.BillPayment;
import com.inayatbank.inayatbank.model.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BillPaymentRepository extends JpaRepository<BillPayment, Long> {
    List<BillPayment> findByAccountOrderByCreatedAtDesc(Account account);
}