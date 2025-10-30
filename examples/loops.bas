DIM i AS INTEGER
DIM sum AS INTEGER = 0

FOR i = 1 TO 10
    sum = sum + i
NEXT i

PRINT "Sum of 1 to 10 is: "; sum

i = 1
WHILE i <= 5
    PRINT "Count: "; i
    i = i + 1
WEND

DO
    PRINT "Enter 0 to quit: "
    INPUT i
LOOP UNTIL i = 0

SLEEP
