import json
import requests


raw = requests.get('https://restcountries.eu/rest/v2/all')

restcountries = raw.json()

countries = []

for country in restcountries:
    countries.append(country['name'])

with open("countries.txt", "w") as fh: 
    fh.write(';'.join(countries))

