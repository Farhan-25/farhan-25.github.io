t = int(input())
count = 0
for _ in range(t):
    pet,vas,ton = map(int , input().split())
    if pet+vas+ton >= 2:
        count += 1       
print(count)