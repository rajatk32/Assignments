local socket = require("socket")
local copas = require("copas")
server = socket.bind("*", 8001)

function echoHandler(skt)
  while true do
    local data = copas.receive(skt)
    if data == "quit" then
      break
    end
	socket.select(nil, nil, math.random(0,2))
    copas.send(skt, "Hi!")
  end
end

copas.addserver(server, echoHandler)
copas.loop()