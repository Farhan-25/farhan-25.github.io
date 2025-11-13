# Crypto Easy Challenge

**Category:** Cryptography  
**Difficulty:** Easy  
**CTF:** PBCTF

## Description

A simple cryptographic challenge that required decoding a base64-encoded message and applying a Caesar cipher.

## Solution

### Step 1: Base64 Decoding

The challenge provided an encoded string:

```
SGVsbG8gV29ybGQ=
```

Decoding it:

```python
import base64
encoded = "SGVsbG8gV29ybGQ="
decoded = base64.b64decode(encoded)
print(decoded.decode())  # Output: "Hello World"
```

![Encoded Message](https://images.unsplash.com/photo-1516321318423-f06f85b504dc?w=800&h=600&fit=crop)
*Caption: The original encoded message from the challenge*

### Step 2: Caesar Cipher

The decoded message was further encrypted with a Caesar cipher (shift of 3):

```python
def caesar_decrypt(text, shift):
    result = ""
    for char in text:
        if char.isalpha():
            ascii_offset = 65 if char.isupper() else 97
            result += chr((ord(char) - ascii_offset - shift) % 26 + ascii_offset)
        else:
            result += char
    return result

message = "Hello World"
decrypted = caesar_decrypt(message, 3)
print(decrypted)  # Output: "Ebiil Tloia"
```

![Decoding Process](https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop)
*Caption: Step-by-step decoding process in Python*

### Step 3: Flag Extraction

After reversing both encodings, the flag was revealed.

![Final Flag](https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop)
*Caption: The decrypted flag displayed in the terminal*

## Flag

```
PBCTF{crypt0_1s_fun}
```

## Screenshots

> **Note:** You can place images inline within any step (as shown above) or group them here at the end. Use relative paths like `./images/screenshot1.png` or absolute URLs.

## Files and Resources

- [Decrypt Script](https://github.com/Farhan-25/CTF-Scripts/blob/main/crypto_decrypt.py) - Complete Python decryption script
- [Challenge Files](https://www.dropbox.com/s/example/crypto_challenge.zip) - Original challenge files and ciphertext
- [Crypto Tools](https://drive.google.com/file/d/example456/view) - Collection of cryptography tools used

## References

- Python script: [decrypt.py](https://github.com/Farhan-25/CTF-Scripts/blob/main/crypto_decrypt.py)
- [Base64 Decoder Tool](https://www.base64decode.org/)
- [Caesar Cipher Explanation](https://en.wikipedia.org/wiki/Caesar_cipher)

