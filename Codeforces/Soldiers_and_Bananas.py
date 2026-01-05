k , n , w = map(int , input().split())
sum = (w*(w+1))/2
amount = k * sum
borrowed_money = int(amount - n)
if(borrowed_money <=0 ):
    print("0")
else:
    print(borrowed_money)
