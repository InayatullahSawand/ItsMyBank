package com.inayatbank.inayatbank.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "bill_payments")
public class BillPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String billerType; // ELECTRICITY, GAS, INTERNET, MOBILE
    private String consumerNumber;
    private BigDecimal amount;
    private String status;
    private LocalDateTime createdAt = LocalDateTime.now();

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getBillerType() { return billerType; }
    public void setBillerType(String billerType) { this.billerType = billerType; }
    public String getConsumerNumber() { return consumerNumber; }
    public void setConsumerNumber(String consumerNumber) { this.consumerNumber = consumerNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public Account getAccount() { return account; }
    public void setAccount(Account account) { this.account = account; }
}