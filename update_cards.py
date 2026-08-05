import os
import re

directory = "src/pages"
files_to_update = ["Explorer.jsx", "Analytics.jsx", "Payments.jsx", "Security.jsx", "Profile.jsx", "Settings.jsx"]

new_card_class = "rounded-[2rem] border border-white/10 bg-slate-950/80 shadow-[0_25px_70px_-40px_rgba(15,23,42,0.75)] backdrop-blur-2xl"

patterns = [
    (re.compile(r'bg-white/10\s+backdrop-blur-xl\s+rounded-2xl'), new_card_class),
    (re.compile(r'bg-white/10\s+backdrop-blur-xl\s+rounded-3xl'), new_card_class),
    (re.compile(r'bg-black/20\s+rounded-xl\s+border\s+border-white/5'), new_card_class),
    (re.compile(r'bg-black/20\s+rounded-xl'), new_card_class),
    (re.compile(r'bg-black/30\s+rounded-xl'), new_card_class),
    (re.compile(r'bg-black/30\s+border\s+border-white/5\s+rounded-xl'), new_card_class),
]

for filename in files_to_update:
    path = os.path.join(directory, filename)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    for pattern, replacement in patterns:
        content = pattern.sub(replacement, content)
        
    if original != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No changes in {filename}")

