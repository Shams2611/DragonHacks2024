from taipy import Gui, Config
import pandas as pd
import datetime

# Create a dataframe to store bird sightings
data = {
    "species": ["Cardinal", "Blue Jay"],
    "latitude": [39.9526, 39.9526],
    "longitude": [-75.1652, -75.1652],
    "time": [datetime.datetime.now(), datetime.datetime.now()],
}
df = pd.DataFrame(data)

# Define the map and form config
map_config = Config.configure_visualization(
    type="map",
    latitude="latitude",
    longitude="longitude",
    tooltip=["species", "time"],
)

form_config = Config.configure_page(page_name="Form", url="/form")

# Define the GUI
gui = Gui(
    dashboard="""# Bird Sightings
                 <*map visualization_id='map' dataframe=df config=map_config*>
                 # Submit a new sighting
                 <*form*>
                    <*input md=6 label='Species' value=new_species*>
                    <*input md=6 label='Latitude' value=new_latitude type='number'*>
                    <*input md=6 label='Longitude' value=new_longitude type='number'*>
                    <*button text='Submit' on_action='submit_sighting'*>
                 </form>
              """,
    css_path="style.css",
)

# Action to add a new sighting
def submit_sighting(state):
    new_entry = {
        "species": state.new_species,
        "latitude": state.new_latitude,
        "longitude": state.new_longitude,
        "time": datetime.datetime.now(),
    }
    global df
    df = pd.concat([df, pd.DataFrame([new_entry])], ignore_index=True)
    state.new_species = ""
    state.new_latitude = ""
    state.new_longitude = ""

gui.run()
