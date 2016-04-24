####
import socket
import sys
import thread
import random
import time
 
HOST = ''
PORT = 8002
 
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

try:
    s.bind((HOST, PORT))
except socket.error as msg:
    sys.exit()
 
s.listen(10)	# queue upto 10 requests
 
def clientthread(conn):
    
    while True:
        data = conn.recv(1024)
        reply = 'Hi!'
        if not data: 
            break
        time.sleep(random.randint(0,2))
        conn.sendall(bytes(reply))
     
    #on breaking out from loop
    conn.close()
 
while 1:
    conn, addr = s.accept()
    print('Connected with ' + addr[0] + ':' + str(addr[1]))
    thread.start_new_thread(clientthread ,(conn,))
 
s.close()