from fastapi import FastAPI, Query
from pydantic import BaseModel
from typing import Optional
import googlemaps
from dotenv import load_dotenv
import os
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS to allow all origins, methods, headers, and credentials
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Load environment variables from .env file
load_dotenv()

# Get the Google API key from environment variables
API_KEY = os.getenv('GOOGLE_API_KEY')

if not API_KEY:
    raise ValueError("No API key found. Please set the GOOGLE_API_KEY environment variable.")

# Initialize the client
gmaps = googlemaps.Client(key=API_KEY)

class Place(BaseModel):
    name: str
    address: str
    latitude: float
    longitude: float
    rating: Optional[float] = None  # Make the rating field optional

@app.get("/locations", response_model=list[Place])
async def search_places(query: str = Query(..., description="The search query for finding places")):
    places_result = gmaps.places(query)
    places = [
        Place(
            name=place['name'],
            address=place['formatted_address'],
            latitude=place['geometry']['location']['lat'],
            longitude=place['geometry']['location']['lng'],
            rating=place.get('rating')  # Handle rating as optional
        )
        for place in places_result['results']
    ]
    return places

@app.get("/directions")
async def get_directions(origin: str = Query(..., description="The origin place"),
                            destination: str = Query(..., description="The destination place")):
    print(origin, destination)
    directions_result = gmaps.directions(origin, destination)
    return directions_result
@app.get('/')
def hello_world():
    return "Hello,World"

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app)
