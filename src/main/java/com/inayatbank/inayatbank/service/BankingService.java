//package com.inayatbank.inayatbank.service;
//
//import com.inayatbank.inayatbank.dto.*;
//import com.inayatbank.inayatbank.model.*;
//import com.inayatbank.inayatbank.repository.*;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//import java.util.*;
//
//@Service
//public class BankingService {
//
//    @Autowired private AccountRepository accountRepository;
//    @Autowired private TransactionRepository transactionRepository;
//    @Autowired private BillPaymentRepository billPaymentRepository;
//    @Autowired private ReminderRepository reminderRepository;
//    @Autowired private UserRepository userRepository;
//
//    @Transactional
//    public ApiResponse payBill(BillRequest request) {
//        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElse(null);
//        if (account == null) return ApiResponse.fail("Account not found");
//        if (account.isFrozen()) return ApiResponse.fail("Account is frozen");
//        if (account.getBalance().compareTo(request.getAmount()) < 0)
//            return ApiResponse.fail("Insufficient balance");
//
//        account.setBalance(account.getBalance().subtract(request.getAmount()));
//        accountRepository.save(account);
//
//        BillPayment bill = new BillPayment();
//        bill.setBillerType(request.getBillerType());
//        bill.setConsumerNumber(request.getConsumerNumber());
//        bill.setAmount(request.getAmount());
//        bill.setStatus("SUCCESS");
//        bill.setAccount(account);
//        billPaymentRepository.save(bill);
//
//        Transaction tx = new Transaction();
//        tx.setType("BILL");
//        tx.setAmount(request.getAmount());
//        tx.setDescription(request.getBillerType() + " Bill - " + request.getConsumerNumber());
//        tx.setStatus("SUCCESS");
//        tx.setFromAccount(account);
//        transactionRepository.save(tx);
//
//        return ApiResponse.ok("Bill paid successfully", bill);
//    }
//
//    public ApiResponse getQRData(String accountNumber) {
//        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
//        if (account == null) return ApiResponse.fail("Account not found");
//
//        Map<String, Object> qr = new HashMap<>();
//        qr.put("accountNumber", account.getAccountNumber());
//        qr.put("accountHolder", account.getUser().getFullName());
//        qr.put("bank", "InayatBank");
//        qr.put("qrText", "INAYATBANK|" + account.getAccountNumber() + "|" + account.getUser().getFullName());
//        return ApiResponse.ok("QR data generated", qr);
//    }
//
//    public ApiResponse chatbot(ChatRequest request) {
//        String msg = request.getMessage() == null ? "" : request.getMessage().toLowerCase();
//        String reply;
//
//        if (msg.contains("balance")) {
//            reply = "To check balance use: GET /api/account/balance/{accountNumber}";
//        } else if (msg.contains("transfer")) {
//            reply = "Transfer: POST /api/account/transfer with fromAccountNumber, toAccountNumber, amount";
//        } else if (msg.contains("deposit")) {
//            reply = "Test Deposit: POST /api/account/deposit with accountNumber and amount";
//        } else if (msg.contains("bill")) {
//            reply = "Pay bill: POST /api/banking/bill with billerType (ELECTRICITY/GAS/INTERNET/MOBILE)";
//        } else if (msg.contains("freeze")) {
//            reply = "Freeze account: PUT /api/account/freeze/{accountNumber}";
//        } else if (msg.contains("hello") || msg.contains("hi")) {
//            reply = "Assalam o Alaikum! Welcome to InayatBank support. Ask about balance, transfer, deposit, bill, or freeze.";
//        } else {
//            reply = "InayatBank is an educational imaginary bank. I can help with: balance, transfer, deposit, bill payment, freeze account.";
//        }
//
//        Map<String, String> data = new HashMap<>();
//        data.put("reply", reply);
//        return ApiResponse.ok("Chatbot reply", data);
//    }
//
//    public ApiResponse addReminder(ReminderRequest request) {
//        User user = userRepository.findById(request.getUserId()).orElse(null);
//        if (user == null) return ApiResponse.fail("User not found");
//
//        Reminder reminder = new Reminder();
//        reminder.setTitle(request.getTitle());
//        reminder.setMessage(request.getMessage());
//        reminder.setRemindAt(LocalDateTime.parse(request.getRemindAt()));
//        reminder.setUser(user);
//        reminderRepository.save(reminder);
//
//        return ApiResponse.ok("Reminder created", reminder);
//    }
//
//    public ApiResponse getReminders(Long userId) {
//        User user = userRepository.findById(userId).orElse(null);
//        if (user == null) return ApiResponse.fail("User not found");
//        return ApiResponse.ok("Reminders", reminderRepository.findByUserOrderByRemindAtAsc(user));
//    }
//
//    public ApiResponse monthlyExpense(String accountNumber) {
//        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
//        if (account == null) return ApiResponse.fail("Account not found");
//
//        List<Transaction> list = transactionRepository
//                .findByFromAccountOrToAccountOrderByCreatedAtDesc(account, account);
//
//        BigDecimal totalOut = BigDecimal.ZERO;
//        Map<String, BigDecimal> byType = new HashMap<>();
//
//        for (Transaction t : list) {
//            if (t.getFromAccount() != null && t.getFromAccount().getId().equals(account.getId())) {
//                totalOut = totalOut.add(t.getAmount());
//                byType.merge(t.getType(), t.getAmount(), BigDecimal::add);
//            }
//        }
//
//        Map<String, Object> data = new HashMap<>();
//        data.put("totalSpent", totalOut);
//        data.put("byType", byType);
//        data.put("transactions", list);
//        return ApiResponse.ok("Monthly expense report", data);
//    }
//}

package com.inayatbank.inayatbank.service;

import com.inayatbank.inayatbank.dto.*;
import com.inayatbank.inayatbank.model.*;
import com.inayatbank.inayatbank.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class BankingService {

    @Autowired private AccountRepository accountRepository;
    @Autowired private TransactionRepository transactionRepository;
    @Autowired private BillPaymentRepository billPaymentRepository;
    @Autowired private ReminderRepository reminderRepository;
    @Autowired private UserRepository userRepository;

    @Transactional
    public ApiResponse payBill(BillRequest request) {
        Account account = accountRepository.findByAccountNumber(request.getAccountNumber()).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");
        if (account.isFrozen()) return ApiResponse.fail("Account is frozen");
        if (account.getBalance().compareTo(request.getAmount()) < 0)
            return ApiResponse.fail("Insufficient balance");

        account.setBalance(account.getBalance().subtract(request.getAmount()));
        accountRepository.save(account);

        BillPayment bill = new BillPayment();
        bill.setBillerType(request.getBillerType());
        bill.setConsumerNumber(request.getConsumerNumber());
        bill.setAmount(request.getAmount());
        bill.setStatus("SUCCESS");
        bill.setAccount(account);
        billPaymentRepository.save(bill);

        Transaction tx = new Transaction();
        tx.setType("BILL");
        tx.setAmount(request.getAmount());
        tx.setDescription(request.getBillerType() + " Bill - " + request.getConsumerNumber());
        tx.setStatus("SUCCESS");
        tx.setFromAccount(account);
        transactionRepository.save(tx);

        return ApiResponse.ok("Bill paid successfully", bill);
    }

    public ApiResponse getQRData(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        String holder = account.getUser() != null ? account.getUser().getFullName() : "Customer";

        Map<String, Object> qr = new HashMap<>();
        qr.put("accountNumber", account.getAccountNumber());
        qr.put("accountHolder", holder);
        qr.put("bank", "ItsMyBank");
        qr.put("qrText", "ITSMYBANK|" + account.getAccountNumber() + "|" + holder);
        return ApiResponse.ok("QR data generated", qr);
    }

    public ApiResponse chatbot(ChatRequest request) {
        String msg = request.getMessage() == null ? "" : request.getMessage().toLowerCase();
        String reply;

        if (msg.contains("balance")) {
            reply = "To check your balance, open the Home tab. Your current account balance is shown there. You can also add demo money using Test Deposit.";
        } else if (msg.contains("transfer") || msg.contains("send")) {
            reply = "To send money, go to the Transfer tab. Enter the receiver account number and amount, then tap Transfer Now.";
        } else if (msg.contains("deposit")) {
            reply = "On the Home tab, use Test Deposit to add 1000, 5000, or 10000 as demo money. This is educational test mode only.";
        } else if (msg.contains("bill")) {
            reply = "Open the Bills tab to pay Electricity, Gas, Internet, or Mobile bills. Enter consumer number and amount, then pay.";
        } else if (msg.contains("freeze")) {
            reply = "On the Home tab, use Freeze Account to temporarily lock your account. You can Unfreeze it anytime.";
        } else if (msg.contains("card")) {
            reply = "Open the Card tab to see your virtual ItsMyBank debit card with name, number, and expiry.";
        } else if (msg.contains("qr")) {
            reply = "Open the QR tab to show your QR code for receiving money, or enter an account number to pay someone.";
        } else if (msg.contains("hello") || msg.contains("hi") || msg.contains("salam")) {
            reply = "Hello! Welcome to ItsMyBank Help. Ask me about balance, transfer, deposit, bills, card, freeze, or QR.";
        } else if (msg.contains("pdf") || msg.contains("statement")) {
            reply = "Open the History tab and tap Download PDF Statement to save your transactions as a PDF file.";
        } else {
            reply = "ItsMyBank is an educational imaginary bank. I can help with: balance, transfer, deposit, bills, card, freeze, and QR.";
        }

        Map<String, String> data = new HashMap<>();
        data.put("reply", reply);
        return ApiResponse.ok("Chatbot reply", data);
    }

    public ApiResponse addReminder(ReminderRequest request) {
        User user = userRepository.findById(request.getUserId()).orElse(null);
        if (user == null) return ApiResponse.fail("User not found");

        Reminder reminder = new Reminder();
        reminder.setTitle(request.getTitle());
        reminder.setMessage(request.getMessage());
        reminder.setRemindAt(LocalDateTime.parse(request.getRemindAt()));
        reminder.setUser(user);
        reminderRepository.save(reminder);

        return ApiResponse.ok("Reminder created", reminder);
    }

    public ApiResponse getReminders(Long userId) {
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) return ApiResponse.fail("User not found");
        return ApiResponse.ok("Reminders", reminderRepository.findByUserOrderByRemindAtAsc(user));
    }

    public ApiResponse monthlyExpense(String accountNumber) {
        Account account = accountRepository.findByAccountNumber(accountNumber).orElse(null);
        if (account == null) return ApiResponse.fail("Account not found");

        List<Transaction> list = transactionRepository
                .findByFromAccountOrToAccountOrderByCreatedAtDesc(account, account);

        BigDecimal totalOut = BigDecimal.ZERO;
        Map<String, BigDecimal> byType = new HashMap<>();

        for (Transaction t : list) {
            if (t.getFromAccount() != null && t.getFromAccount().getId().equals(account.getId())) {
                totalOut = totalOut.add(t.getAmount());
                byType.merge(t.getType(), t.getAmount(), BigDecimal::add);
            }
        }

        Map<String, Object> data = new HashMap<>();
        data.put("totalSpent", totalOut);
        data.put("byType", byType);
        data.put("transactions", list);
        return ApiResponse.ok("Monthly expense report", data);
    }
}