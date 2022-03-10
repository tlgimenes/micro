export const hmr = (refreshPath: string) => {
  let socket: WebSocket | undefined;
  let reconnectionTimerId: number | undefined;

  // Construct the WebSocket url from the current
  // page origin.
  const requestUrl = `${window.location.origin.replace("http", "ws")}${refreshPath}`;

  // Kick off the connection code on load.
  connect(() => log('connected'));

  /**
   * Info message logger.
   */
  function log(message: string) {
    console.info("[refresh]: ", message);
  }

  /**
   * Refresh the browser.
   */
  function refresh() {
    window.location.reload();
  }

  /**
   * Create WebSocket, connect to the server and
   * listen for refresh events.
   */
  function connect(callback: (e: Event) => void) {
    // Close any existing sockets.
    if (socket) {
      socket.close();
    }

    // Create a new WebSocket pointing to the server.
    socket = new WebSocket(requestUrl);

    // When the connection opens, execute the callback.
    socket.addEventListener("open", callback);

    // Add a listener for messages from the server.
    socket.addEventListener("message", (event) => {
      try {
        const data = JSON.parse(event.data);

        // Check whether we should refresh the browser.
        if (data?.type === "refresh") {
          log("refreshing...");
          refresh();
        }
      } catch (_) {
        // JSON.parse errored. Maybe the message wasn't for us
      }
    });

    // Handle when the WebSocket closes. We log
    // the loss of connection and set a timer to
    // start the connection again after a second.
    socket.addEventListener("close", () => {
      log("connection lost - reconnecting...");

      clearTimeout(reconnectionTimerId);

      reconnectionTimerId = setTimeout(() => {
        // Try to connect again, and if successful
        // trigger a browser refresh.
        connect(refresh);
      }, 1000);
    });
  }
};
