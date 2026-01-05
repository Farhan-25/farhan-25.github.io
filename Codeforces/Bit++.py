t = int(input())
x = 0
for _ in range(t):
    s = input()
    if "++" in s:
        x += 1
    elif "--" in s:
        x -= 1
print(x)
