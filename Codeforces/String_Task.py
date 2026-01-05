s = input().lower()
vowels = ["a", "o", "y", "e", "u", "i"]
for v in vowels:
    s = s.replace(v, "")
result = ""
for ch in s:
    result += "." + ch
print(result)
