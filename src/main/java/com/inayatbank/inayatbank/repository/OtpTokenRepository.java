package com.inayatbank.inayatbank.repository;

import com.inayatbank.inayatbank.model.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {

    Optional<OtpToken> findByEmailAndOtpAndUsedFalse(String email, String otp);

    @Modifying
    @Transactional
    @Query("DELETE FROM OtpToken o WHERE o.email = ?1")
    void deleteByEmail(String email);
}