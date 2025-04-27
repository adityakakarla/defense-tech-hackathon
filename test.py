import asyncio
import websockets

async def receive_data():
    async with websockets.connect("ws://10.1.62.240:8766") as websocket:
        while True:
            data = await websocket.recv()  # Receive data from the server
            print(f"Received: {data}")

asyncio.run(receive_data())