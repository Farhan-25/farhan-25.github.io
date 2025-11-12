# Web Challenge

**Category:** Web Security  
**Difficulty:** Hard  
**CTF:** R3CTF

## Description

A complex web application challenge involving multiple security vulnerabilities including XSS, CSRF, and file upload vulnerabilities.

## Solution

### Step 1: Initial Analysis

I started by analyzing the web application structure and identifying entry points.

### Step 2: Vulnerability Discovery

Found a file upload vulnerability that allowed arbitrary file uploads.

### Step 3: Exploitation

Uploaded a malicious PHP shell and gained remote code execution.

## Screenshots

![Initial Reconnaissance](https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800&h=600&fit=crop)
*Initial reconnaissance of the web application*

![File Upload Interface](https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop)
*The vulnerable file upload interface*

![Webshell Access](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&h=600&fit=crop)
*Gained remote code execution through uploaded webshell*

![Flag Extraction](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Extracted the final flag from the server*

## Files and Resources

- [Webshell Payload](https://github.com/Farhan-25/CTF-Scripts/blob/main/php_webshell.php) - PHP webshell used for RCE
- [Exploit Chain Script](https://www.dropbox.com/s/example/web_exploit.py) - Automated exploit script
- [Burp Suite Config](https://drive.google.com/file/d/example789/view) - Burp Suite configuration for the challenge

## Flag

```
R3CTF{w3b_3xpl01t4t10n_m45t3r}
```

## References

- [File Upload Vulnerabilities](https://owasp.org/www-community/vulnerabilities/Unrestricted_File_Upload)
- [Web Application Security Testing](https://portswigger.net/web-security)

