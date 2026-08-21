# TryHackMe: Year of the Rabbit

**Difficulty**: Easy

## Step - 1
First of all start the machine and find all the open ports using the following command.
```bash
nmap -p- --min-rate=10000 -T4 <IP>
```

We would get the following ports.

![Nmap scan results](../images/5b0f3c27f7a95a848760899761af4c54.png)

## Step 2
As port 80 is open we can use gobuster to find hidden directories and files.

![Gobuster results](../images/143eb5c15c4ca3b9e108a3bdbd90596f.png)

Now we can see there is a dir named `assets` lets explore it. We get 2 files in it a `styles.css` and `RickRolled.mp4`. After reading through `styles.css` we find this, its a path to a php site. Lets explore it.

![Path to PHP site found in styles.css](../images/ad1a1f5b50662ebe2a62d22f235626ee.png)

After searching it found a alert message with the following message,

![Alert message](../images/e249ff6939ca4dc407d394ec77b5d71b.png)

Hmm! interesting we now have 2 ways to solve this:
1. Turn of javascript as the message says, Now to turn of javascript in firefox you have to go to `about:config` --> search `javascript.enabled` and change its value to false.
2. (Which i used) press F12, it will open the inspect, then go to the debugger section and there you will see something like this:

![Debugger analysis](../images/9b4ae3316aadb50c522841db14a4562e.png)

## Step 3
With not a proper lead and constant redirecting to the rick roll youtube channel i decided to curl it and got the hidden directory `/WExYY2Cv-qU`

![Hidden directory CURL results](../images/e812937fdff11bb77d57515d40f07dd9.png)

![Hot_Babe.png](../images/af94a8ad849164fa1dae57df002fddaa.png)

a file named `Hot_Babe.png` lets download and use exiftool on it nothing important, then i tried strings.

![Strings on image](../images/67b5a1dc8d9d62d43e8743353770e631.png)

We got the FTP username `ftpuser` and we also got a list of passwords. We can use hydra to find the correct password. Save the following password as `password.txt` and then run the following command:
```bash
hydra -l ftpuser -P password.txt ftp://<IP>
```

![Hydra FTP password crack](../images/e89881766225ab5696c656348fc62209.png)

got the password now lets connect with FTP.

![FTP connection](../images/2096121a36d43ed19bf651e72016f841.png)

After connecting with FTP we can see the files using `ls`, a file named `Eli's_Creds.txt` is found, lets get it using the command `get Eli's_Creds.txt` then exit the system and cat the file.

we get this
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

Now if you have been doing CTFs and all this is Brain Fuck encoded code

![BrainFuck decoding](../images/16dbfa77d9ac58adaba3977e716abcf2.png)

we got the ssh creds now lets login

![SSH login](../images/16b58d417c4111482d6c5e03f9832345.png)

we have a message `"Gwendoline, I am not happy with you. Check our leet s3cr3t hiding place. I've left you a hidden message there"`

While enumerating as eli, I searched the system for anything matching “s3cr3t” and discovered a hidden directory at `/usr/games/s3cr3t`. Inside was a file containing a note from root that revealed Gwendoline’s password. Using this password, I switched users with `su gwendoline` and gained access to her account, allowing me to read the `user.txt` flag.

```bash
find / -type d -name "*s3cr3t*" 2>/dev/null
```

![Finding secret directory](../images/8f9732ed0b0dc10900f7deec9191c0f3.png)

Got the first flag `THM{1107174691af9ff3681d2b5bdb5740b1589bae53}`

Now lets try to escalate privileges, for this lets see what commands we can execute as Gwendoline using `sudo -l`

![Checking sudo privileges](../images/68f19768a7a9b22e4c2c83ca5a244ccf.png)

```bash
sudo -u#1 /usr/bin/vi /home/gwendoline/user.txt
```

By a using sudo misconfiguration and using a kind of exploit we get the flag

![Final flag after privilege escalation](../images/9e3c1ec3fe907ba8789595e03f1d0a89.png)

