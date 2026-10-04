# Génère candice-23.html (autonome) à partir de candice-23.src.html en y intégrant la police « 23 ».
import json, pathlib
here = pathlib.Path(__file__).parent
src = (here / "candice-23.src.html").read_text()
font = json.loads((here.parent / "public/fonts/gentilis_bold.json").read_text())
font = {**font, "glyphs": {k: font["glyphs"][k] for k in "23"}}
font.pop("original_font_information", None)
(here / "candice-23.html").write_text(src.replace("/*FONT23*/null", json.dumps(font, separators=(",", ":"))))
print("candice-23.html généré")
