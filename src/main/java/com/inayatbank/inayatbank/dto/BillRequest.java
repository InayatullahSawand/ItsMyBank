package com.inayatbank.inayatbank.dto;

import java.math.BigDecimal;

public class BillRequest {
    private String accountNumber;
    private String billerType;
    private String consumerNumber;
    private BigDecimal amount;

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }
    public String getBillerType() { return billerType; }
    public void setBillerType(String billerType) { this.billerType = billerType; }
    public String getConsumerNumber() { return consumerNumber; }
    public void setConsumerNumber(String consumerNumber) { this.consumerNumber = consumerNumber; }
    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }
}