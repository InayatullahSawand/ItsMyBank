package com.inayatbank.inayatbank.repository;

import com.inayatbank.inayatbank.model.Reminder;
import com.inayatbank.inayatbank.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findByUserOrderByRemindAtAsc(User user);
}