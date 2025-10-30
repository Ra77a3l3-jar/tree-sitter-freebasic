SUB greet(name AS STRING)
    PRINT "Welcome, "; name; "!"
END SUB

SUB calculate(a AS INTEGER, b AS INTEGER)
    DIM result AS INTEGER
    result = a + b
    PRINT a; " + "; b; " = "; result
END SUB

greet("Alice")
greet("Bob")
calculate(5, 3)
calculate(10, 20)

SLEEP
