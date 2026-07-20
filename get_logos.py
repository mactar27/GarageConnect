import urllib.request
import base64
import json

def get_base64_img(url):
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        img_data = urllib.request.urlopen(req).read()
        return "data:image/png;base64," + base64.b64encode(img_data).decode('utf-8')
    except Exception as e:
        return str(e)

# Wave logo from Play Store (app icon)
wave_url = "https://play-lh.googleusercontent.com/9C8oH-iQdO1iQoO820gV0yR2eE8zQ5Wk_M6z4YxP-8k8s8w6x2K5Y_2i-k2x-2u2Yw=w240-h240-rw"
# Orange Money logo from Play Store
om_url = "https://play-lh.googleusercontent.com/9nF6iC_D2QJ0sA2FkV_sXJmB0F3A_0N0h_0F00K_0D_0S_0F0H0M_0O_0N0E_0Y_0A=w240-h240-rw"

wave_b64 = get_base64_img(wave_url)
om_b64 = get_base64_img(om_url)

with open('logos.json', 'w') as f:
    json.dump({"wave": wave_b64[:50] + "...", "om": om_b64[:50] + "..."}, f)

with open('/Users/wocky/Desktop/Fatou/frontend/src/assets/images/wave-logo.png', 'wb') as f:
    try:
        req = urllib.request.Request(wave_url, headers={'User-Agent': 'Mozilla/5.0'})
        f.write(urllib.request.urlopen(req).read())
    except: pass

with open('/Users/wocky/Desktop/Fatou/frontend/src/assets/images/om-logo.png', 'wb') as f:
    try:
        req = urllib.request.Request(om_url, headers={'User-Agent': 'Mozilla/5.0'})
        f.write(urllib.request.urlopen(req).read())
    except: pass
