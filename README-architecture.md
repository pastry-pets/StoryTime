# Websockets and Round Architecture

[Main Readme](README.md)

This project uses websockets to coordinate sending prompts, posts, and votes to all clients without the clients having to request updated information from the server constantly. The library used is [Socket.IO](socket.io) - refer to the library documentation for implementation information. This README is written to explain where and how the application interacts with the websockets, how data flows between the client and server, and the story cycle that forms the core of the app.

### Server Side

The Express app, the http server, and the websocket server itself are all defined in /server/socket.js and exported from there. /server/index.js attaches routes to the Express app and starts listening on the http server. The websocket server is imported into /server/control.js, which is where most of the websocket and round logic happens.



### Client Side

On the client side,

### Stories and Badges



### The Round Cycle

1. The first client joins.

The server begins a new round in a new story. A new prompt is generated (either from the API or from the cached API data) and saved to the database, and the server sets a timer for the end of the round based on the environment variables. The server sends the prompt and end time to the client.

2. A user submits a response.

The new response is saved to the database immediately. Then a response object is added to the `roundData.responses` object, using the database id as a key for easy lookup when voting. The new response object and its id are sent to all clients for they can add display it.

3. A user votes on a response.

The vote count for the response is updated in memory (vote counts aren't saved to the database until the end of a round), and the server informs all clients of the vote change so they can update their displays.

Votes use a delta to determine how much the vote count should change, which is more flexible than simply incrementing/decrementing. For example, a user changing from a downvote to an upvote should increase the vote count by 2, not 1.

4. The round ends.

If any users submitted responses during the round, the winner is chosen from them, judging by final vote count, with earlier submissions winning in case of ties. The winner and final vote counts are marked in the database, and the winning text is added to the current canon and sent to all users to update the canon  client-side.

If no responses were submitted, the story ends.

Assuming there are still users connected, the next round starts immediately, and the new prompt and timer are sent to all connected clients. See "The last client leaves" for what happens if there are no remaining connections.

5. A story ends.

The current canon is cleared. If awards were functional, they would be awarded here. If a new story will start, the new story's badge is created here.

7. A new round begins.

The server generates a new prompt and timer, saves the prompt, and sends that data to all clients. There is no difference if the story is also new - the logic for creating badges happens either in `startPromptCycle()` (when the first user joins) or in `endStory()` (which also handles resetting the canon).

8. A user joins during a round.

When new clients join during a round, the server sends them the roundData object, which includes the current prompt, canon, responses (with their vote status), and round end time, so the new client can synchronize with everyone else.

9. The last client leaves.

The server flips the `stopAfterNext` flag to true. If any client joins before the current prompt ends, the flag will be flipped back to false and everything will continue as if nothing happened. However, if when the current prompt ends the `stopAfterNext` flag is still true, meaning no clients are connected, the story will end (even if responses were submitted this round). No new story/round will begin until a new client connects and restarts the cycle.

[Main Readme](README.md)