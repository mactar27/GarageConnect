import urllib.request
import json
import re

def get_image(query):
    url = "https://html.duckduckgo.com/html/?q=" + query.replace(" ", "+")
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        matches = re.findall(r'src="([^"]+)"', html)
        for match in matches:
            if match.startswith('//'):
                return "https:" + match
    except Exception as e:
        return str(e)

print("Wave:", get_image("wave mobile money logo png"))
print("Orange:", get_image("orange money logo png"))
