package com.inayatbank.inayatbank.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    public void sendOtp(String toEmail, String otp) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("InayatBank - Your OTP Code");
        message.setText(
                "Assalam o Alaikum,\n\n" +
                        "Your InayatBank OTP is: " + otp + "\n\n" +
                        "This OTP is valid for 5 minutes.\n\n" +
                        "If you did not request this, please ignore.\n\n" +
                        "Note: InayatBank is an educational/imaginary banking project.\n" +
                        "Regards,\nInayatBank Team"
        );
        mailSender.send(message);
    }
}