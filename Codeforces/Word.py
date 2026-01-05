s = input()
lower_count = 0
upper_count = 0
for ch in s:
    if(ch.islower() == True):
        lower_count += 1
    else:
        upper_count += 1
if(lower_count >= upper_count):
    print(s.lower())
else:
    print(s.upper())
