# Description

Put together three basic HTTP servers - one in Go, one in Python and one in Lua.

    - Keep them as simple as possible, e.g responding "Hi!" to every request is sufficient.
    - Use any HTTP libraries you want, e.g http/net for Go, werkzeug for Python and xavante for Lua.
    - To simulate long-lived connections, you may want to put a random `sleep` in there.
    - Write as little code as possible

Write deployment script(s) for the servers.
    - It should be invoked something like `./deploy-servers go-server lua-server python-server`
    - It should be able to deploy one or multiple servers
    - It should be able to deploy the servers to multiple machines
    - You can assume that there is a script that lists machine hostnames for a given server name, e.g `./get-hostnames go-server`
    - You can also assume that all required server dependencies are installed on the target machines
    - When deploying a new server version, open connections to the old server version must not be interrupted
    - There must always be an unchanging way to reach the most recent version of any given server.
        (e.g have :8000 always go to the newest go-server version, :8001 to lua-server, and :8002 to python-server)