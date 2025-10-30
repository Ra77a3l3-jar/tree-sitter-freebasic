FUNCTION factorial(n AS INTEGER) AS INTEGER
    IF n <= 1 THEN
        RETURN 1
    ELSE
        RETURN n * factorial(n - 1)
    END IF
END FUNCTION

DIM num AS INTEGER
PRINT "Enter a number: "
INPUT num

PRINT "Factorial of "; num; " is "; factorial(num)
SLEEP
