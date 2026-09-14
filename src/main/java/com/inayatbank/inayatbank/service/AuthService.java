package com.inayatbank.inayatbank.service;

import com.inayatbank.inayatbank.dto.*;
import com.inayatbank.inayatbank.model.*;
import com.inayatbank.inayatbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {

    @Autowired private UserRepository userRepository;
    @Autowired private AccountRepository accountRepository;
    @Autowired private CardRepository cardRepository;
    @Autowired private OtpTokenRepository otpTokenRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private EmailService emailService;

    @Transactional
    public ApiResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ApiResponse.fail("Email already registered");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setRole("USER");
        userRepository.save(user);

        // Create Savings Account
        Account account = new Account();
        account.setAccountNumber(generateAccountNumber());
        account.setAccountType("SAVINGS");
        account.setBalance(BigDecimal.ZERO);
        account.setUser(user);
        accountRepository.save(account);

        // Create Virtual Debit Card
        Card card = new Card();
        card.setCardNumber(generateCardNumber());
        card.setCardHolderName(user.getFullName().toUpperCase());
        card.setExpiry("12/30");
        card.setCvv(String.valueOf(100 + new Random().nextInt(900)));
        card.setAccount(account);
        cardRepository.save(card);

        // Send OTP for verification (optional on register)
        sendOtpToEmail(user.getEmail());

        return ApiResponse.ok("Registration successful. OTP sent to email.",
                new AuthResponse("Registered", user.getEmail(), user.getFullName(), user.getRole(), user.getId()));
    }
    @Transactional
    public ApiResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElse(null);

        if (user == null) {
            return ApiResponse.fail("Invalid email or password");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ApiResponse.fail("Invalid email or password");
        }

        if (!user.isEnabled()) {
            return ApiResponse.fail("Account is blocked by admin");
        }

        // Send OTP on login
        sendOtpToEmail(user.getEmail());

        return ApiResponse.ok("OTP sent to your email. Please verify.",
                new AuthResponse("OTP_SENT", user.getEmail(), user.getFullName(), user.getRole(), user.getId()));
    }

    public ApiResponse verifyOtp(OtpRequest request) {
        OtpToken token = otpTokenRepository
                .findByEmailAndOtpAndUsedFalse(request.getEmail(), request.getOtp())
                .orElse(null);

        if (token == null) {
            return ApiResponse.fail("Invalid OTP");
        }

        if (token.getExpiryTime().isBefore(LocalDateTime.now())) {
            return ApiResponse.fail("OTP expired");
        }

        token.setUsed(true);
        otpTokenRepository.save(token);

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);
        if (user == null) {
            return ApiResponse.fail("User not found");
        }

        return ApiResponse.ok("Login successful",
                new AuthResponse("SUCCESS", user.getEmail(), user.getFullName(), user.getRole(), user.getId()));
    }

    @Transactional
    public void sendOtpToEmail(String email) {
        String otp = String.valueOf(100000 + new Random().nextInt(900000));

        otpTokenRepository.deleteByEmail(email);

        OtpToken token = new OtpToken();
        token.setEmail(email);
        token.setOtp(otp);
        token.setExpiryTime(LocalDateTime.now().plusMinutes(5));
        token.setUsed(false);
        otpTokenRepository.save(token);

        emailService.sendOtp(email, otp);
    }

    private String generateAccountNumber() {
        return "IB" + (1000000000L + new Random().nextInt(900000000));
    }

    private String generateCardNumber() {
        Random r = new Random();
        return String.format("%04d %04d %04d %04d",
                4000 + r.nextInt(1000),
                r.nextInt(10000),
                r.nextInt(10000),
                r.nextInt(10000));
    }
}