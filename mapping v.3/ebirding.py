api_key = "e6l5nfin287g"

import csv
from ebird.api import get_observations, get_nearby_observations

# records = get_observations(api_key, 39.9596, -75.1904, dist=10, back=7)
records = get_nearby_observations(api_key, 38.05, -122.94, dist=10, back=7)
print(records[0])

with open('profiles1.csv', 'w', newline='') as file:
    writer = csv.writer(file)
    field = ["speciesCode", "comName", "sciName", "locId", "locName", "obsDt", "howMany", "lat", "lng", "obsValid", "locationPrivate", "subId"]
    
    writer.writerow(field)
    for element in records:
        writer.writerow(list(element.values()))
    # writer.writerow(["Oladele Damilola", "40", "Nigeria"])
    # writer.writerow(["Alina Hricko", "23", "Ukraine"])
    # writer.writerow(["Isabel Walter", "50", "United Kingdom"])