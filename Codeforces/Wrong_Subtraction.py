n , k = map(int , input().split())
for _ in range(k):
    unit_place = n % 10
    if(unit_place > 0):
        unit_place -= 1
        n = n - 1
    else:
        n = int(n/10)
print(n)