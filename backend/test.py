from db_connection import get_db_connection

BILL = 800
dictt = {
    "himanshu":100,
    "eye_test":200,
    "blood_test":100,
    "x-ray":300
}
con = get_db_connection()
cur = con.cursor()
cur.execute('select pname from history where id = 69')
rec = cur.fetchall()
print(rec)
cur.close()
con.close()

gg = "[('blood_test' , 'x-ray')]"

for test, bill in dictt.items():
    if test in gg:
        BILL = BILL + bill

print(BILL)





