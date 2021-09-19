from flask import Flask, request
from flask_socketio import SocketIO, send, emit
from flask_cors import CORS, cross_origin

messages = []

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
io = SocketIO(app, cors_allowed_origins='*')

@io.on("connect")
def connection_handler(msg):
	app.logger.info("\n\nMessage from client: [%s]\n\n", msg)
	emit('who_am_i', {'data': request.sid})

@io.on("send_message")
def send_message_handler(msg):
	app.logger.info("\n\nUser [%s] send message [%s]\n\n", request.sid, msg)
	room_data_client = {"id": request.sid, "message": msg}
	messages.append(room_data_client)
	emit("get_message", room_data_client, broadcast=True)

@io.on("page_reload")
def page_reload_handler(msg):
	app.logger.info(messages)
	send(messages)

if __name__ == '__main__':
	io.run(app, debug=True, host="0.0.0.0")