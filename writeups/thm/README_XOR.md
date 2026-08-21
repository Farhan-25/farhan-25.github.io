# XOR Decryption Walkthrough

This document explains the step-by-step process used to decrypt the XOR-encoded flag from the `nc 10.49.136.93 1337` challenge.

## 1. Challenge Analysis

We were given a hex-encoded string:
`200e2b0e3d45270a1b39313e1234390072051e2e352814462c180a1f1d1806321f4538063e290730`

The server source code (`source-1705339805281.py`) revealed:
- The encryption is a simple XOR operation.
- The key is a random 5-character string from `string.ascii_letters + string.digits`.
- The flag follows the TryHackMe format: `THM{...}`.

## 2. Key Derivation

A repeating XOR key can be broken if part of the original message (plaintext) is known. This is called a **Known-Plaintext Attack**.

### Finding the first 4 bytes
Since we know the flag starts with `THM{`, we can XOR the first 4 bytes of the ciphertext with these characters to find the first 4 bytes of the key:

| Ciphertext (Hex) | Plaintext | Key (Hex) | Key (Char) |
| :--- | :--- | :--- | :--- |
| `0x20` | `T` (0x54) | `0x20 ^ 0x54 = 0x74` | `t` |
| `0x0e` | `H` (0x48) | `0x0e ^ 0x48 = 0x46` | `F` |
| `0x2b` | `M` (0x4d) | `0x2b ^ 0x4d = 0x66` | `f` |
| `0x0e` | `{` (0x7b) | `0x0e ^ 0x7b = 0x75` | `u` |

### Finding the 5th byte
Since the key length is 5, and the ciphertext is 40 bytes long, the last byte of the ciphertext (index 39) corresponds to the 5th byte of the key ($39 \pmod 5 = 4$). We assume the flag ends with `}` (0x7d):

| Ciphertext (Hex) | Plaintext | Key (Hex) | Key (Char) |
| :--- | :--- | :--- | :--- |
| `0x30` | `}` (0x7d) | `0x30 ^ 0x7d = 0x4d` | `M` |

**Full Key:** `tFfuM`

## 3. Decryption

By XORing the entire ciphertext with the repeating key `tFfuM`, we get the final flag:

| Index | Ciphertext | Key | Result |
| :--- | :--- | :--- | :--- |
| 0 | `0x20` | `t` | `T` |
| 1 | `0x0e` | `F` | `H` |
| 2 | `0x2b` | `f` | `M` |
| 3 | `0x0e` | `u` | `{` |
| 4 | `0x3d` | `M` | `p` |

**Final Flag:** `THM{p1alntExtAtt4ckcAnr3alLyhUrty0urxOr}`

## 4. Automation Script

You can use this Python snippet to automate the decryption:

```python
def xor_decrypt(hex_data, key):
    data = bytes.fromhex(hex_data)
    key_bytes = key.encode()
    return "".join(chr(data[i] ^ key_bytes[i % len(key_bytes)]) for i in range(len(data)))

ciphertext = "200e2b0e3d45270a1b39313e1234390072051e2e352814462c180a1f1d1806321f4538063e290730"
key = "tFfuM"
print(xor_decrypt(ciphertext, key))
```
