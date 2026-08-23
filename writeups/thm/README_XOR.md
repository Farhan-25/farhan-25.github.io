# TryHackMe: XOR Decryption Walkthrough

**Difficulty:** Easy  
**Platform:** TryHackMe  
**Category:** Cryptography / Python / Known-Plaintext Attack  

---

## Overview & Attack Path
1. **Challenge Analysis:** Analyzing the hex ciphertext and server source code to understand the repeating-key XOR algorithm.
2. **Key Derivation (Known-Plaintext Attack):** Using known flag structure (`THM{` and `}`) to recover the complete 5-byte key.
3. **Decryption:** XORing the entire ciphertext with the derived key to reveal the flag.
4. **Automation Script:** Writing a reusable Python script to automate decryption.

---

## Step 1: Challenge Analysis

Connecting to the netcat challenge service (`nc <TARGET_IP> 1337`) yields the following hex-encoded ciphertext:

```text
200e2b0e3d45270a1b39313e1234390072051e2e352814462c180a1f1d1806321f4538063e290730
```

Reviewing the challenge source code (`source-1705339805281.py`) reveals key properties:
* The encryption mechanism is a standard repeating XOR operation.
* The secret key is a random **5-character** string chosen from `string.ascii_letters + string.digits`.
* The flag follows standard TryHackMe format: `THM{...}`.

---

## Step 2: Key Derivation (Known-Plaintext Attack)

Because XOR is reversible ($Ciphertext \oplus Plaintext = Key$), knowing any portion of the plaintext allows calculating the corresponding key bytes.

### 1. Recovering the First 4 Key Bytes
We know the flag begins with `THM{`. XORing the first 4 bytes of ciphertext with `THM{` yields the first 4 characters of the key:

| Ciphertext (Hex) | Plaintext | XOR Operation | Key (Char) |
| :--- | :--- | :--- | :--- |
| `0x20` | `T` (0x54) | `0x20 ^ 0x54 = 0x74` | `t` |
| `0x0e` | `H` (0x48) | `0x0e ^ 0x48 = 0x46` | `F` |
| `0x2b` | `M` (0x4d) | `0x2b ^ 0x4d = 0x66` | `f` |
| `0x0e` | `{` (0x7b) | `0x0e ^ 0x7b = 0x75` | `u` |

---

### 2. Recovering the 5th Key Byte
The key length is 5 and the ciphertext length is 40 bytes. The last byte (index 39) corresponds to key index $39 \pmod 5 = 4$ (the 5th character).

Since valid flags end with `}` (0x7d):

| Ciphertext (Hex) | Plaintext | XOR Operation | Key (Char) |
| :--- | :--- | :--- | :--- |
| `0x30` | `}` (0x7d) | `0x30 ^ 0x7d = 0x4d` | `M` |

**Full Recovered Key:** `tFfuM`

---

## Step 3: Decryption & Flag Retrieval

XORing the ciphertext with the repeating key `tFfuM` produces the original plaintext:

| Index | Ciphertext | Key | Decrypted Character |
| :--- | :--- | :--- | :--- |
| 0 | `0x20` | `t` | `T` |
| 1 | `0x0e` | `F` | `H` |
| 2 | `0x2b` | `f` | `M` |
| 3 | `0x0e` | `u` | `{` |
| 4 | `0x3d` | `M` | `p` |

> **Final Flag:** `THM{p1alntExtAtt4ckcAnr3alLyhUrty0urxOr}`

---

## Step 4: Python Automation Script

The entire attack can be automated with this clean Python script:

```python
def xor_decrypt(hex_data: str, key: str) -> str:
    data = bytes.fromhex(hex_data)
    key_bytes = key.encode()
    return "".join(chr(data[i] ^ key_bytes[i % len(key_bytes)]) for i in range(len(data)))

ciphertext = "200e2b0e3d45270a1b39313e1234390072051e2e352814462c180a1f1d1806321f4538063e290730"
key = "tFfuM"

decrypted_flag = xor_decrypt(ciphertext, key)
print(f"Decrypted Flag: {decrypted_flag}")
```

---

## Summary of Answers

| Item | Value |
| :--- | :--- |
| **Attack Type** | Known-Plaintext XOR Attack |
| **Key Length** | 5 Characters |
| **Recovered Key** | `tFfuM` |
| **Decrypted Flag** | `THM{p1alntExtAtt4ckcAnr3alLyhUrty0urxOr}` |
