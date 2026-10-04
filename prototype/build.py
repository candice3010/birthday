# Génère, à partir de candice-23.src.html :
#  - candice-23.html            : version publiée en page Claude (sans <html>/<head>, ajoutés à la publication)
#  - candice-23-standalone.html : fichier autonome à ouvrir directement dans un navigateur
import json, pathlib
here = pathlib.Path(__file__).parent
src = (here / "candice-23.src.html").read_text()
font = json.loads((here.parent / "public/fonts/gentilis_bold.json").read_text())
font = {**font, "glyphs": {k: font["glyphs"][k] for k in "23"}}
font.pop("original_font_information", None)
body = src.replace("/*FONT23*/null", json.dumps(font, separators=(",", ":")))
(here / "candice-23.html").write_text(body)
standalone = (
    '<!doctype html>\n<html lang="fr">\n<head>\n<meta charset="utf-8">\n'
    '<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">\n'
    '<style>body{margin:0}</style>\n</head>\n<body>\n' + body + '\n</body>\n</html>\n'
)
(here / "candice-23-standalone.html").write_text(standalone)
print("candice-23.html + candice-23-standalone.html générés")
