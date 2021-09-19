from flask import Flask, request
from flask_socketio import SocketIO, send, emit, join_room
from flask_cors import CORS, cross_origin

messages = []

app = Flask(__name__)
app.config['SECRET_KEY'] = 'mysecret'   
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
io = SocketIO(app, cors_allowed_origins='*')

@io.on("connect")
def handle_connection():
	print("USER SOCKET ID:", request.sid)
	emit('who_am_i', {'data': request.sid})

@io.on("send_message")
def handle_message(msg):
	messages.append(msg)
	print('Message: ' + msg)
	room_data = {"id": request.sid, "message": msg}
	emit("get_message", room_data, broadcast=True)

@io.on("message")
def message_handler(msg):
	send(messages)

if __name__ == '__main__':
	io.run(app, debug=True)