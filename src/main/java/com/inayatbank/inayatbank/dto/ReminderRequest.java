package com.inayatbank.inayatbank.dto;

public class ReminderRequest {
    private Long userId;
    private String title;
    private String message;
    private String remindAt; // "2026-09-20T10:00:00"

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    public String getRemindAt() { return remindAt; }
    public void setRemindAt(String remindAt) { this.remindAt = remindAt; }
}