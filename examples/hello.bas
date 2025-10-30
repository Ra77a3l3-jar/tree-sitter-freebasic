DIM name AS STRING

PRINT "What's your name?"
INPUT name

IF name = "" THEN
    PRINT "Hello, stranger!"
ELSE
    PRINT "Hello, "; name; "!"
END IF

SLEEP
