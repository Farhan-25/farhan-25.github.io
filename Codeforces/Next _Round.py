n, k = map(int, input().split())
scores = list(map(int, input().split()))

cutoff = scores[k - 1]
count = 0

for score in scores:
    if score >= cutoff and score > 0:
        count += 1

print(count)
