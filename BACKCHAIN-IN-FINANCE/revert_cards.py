import os
import re

directory = "src/pages"
files_to_update = ["Dashboard.jsx", "Explorer.jsx", "Analytics.jsx", "Payments.jsx", "Security.jsx", "Profile.jsx", "Settings.jsx"]

# Patterns to find:
# 1. The main dashboard card (p-6 included inside)
pattern1 = re.compile(r'rounded-\[2rem\]\s+border\s+border-white/10\s+bg-slate-950/80\s+p-6\s+shadow-\[0_30px_80px_-50px_rgba\(15,23,42,0\.8\)\]\s+backdrop-blur-2xl')
# 2. The smaller dashboard cards (p-6 included inside)
pattern2 = re.compile(r'rounded-\[2rem\]\s+border\s+border-white/10\s+bg-slate-950/80\s+p-6\s+shadow-\[0_25px_70px_-40px_rgba\(15,23,42,0\.75\)\]\s+backdrop-blur-2xl(?:\s+perspective-1000)?')
# 3. The class I injected into other pages (no p-6 inside)
pattern3 = re.compile(r'rounded-\[2rem\]\s+border\s+border-white/10\s+bg-slate-950/80\s+shadow-\[0_25px_70px_-40px_rgba\(15,23,42,0\.75\)\]\s+backdrop-blur-2xl')

replacement_with_p6 = "bg-white/10 backdrop-blur-xl rounded-2xl p-6"
replacement_no_p6 = "bg-white/10 backdrop-blur-xl rounded-2xl"

for filename in files_to_update:
    path = os.path.join(directory, filename)
    if not os.path.exists(path):
        continue
        
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()
        
    original = content
    content = pattern1.sub(replacement_with_p6, content)
    content = pattern2.sub(replacement_with_p6, content)
    content = pattern3.sub(replacement_no_p6, content)
        
    if original != content:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Updated {filename}")
    else:
        print(f"No changes in {filename}")

