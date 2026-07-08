#!/bin/bash
rm -f ~/Desktop/pokejap-final/.git/HEAD.lock
cd ~/Desktop/pokejap-final
git remote set-url origin https://github.com/Pokejap/pokejap.git
git add -A
git diff --cached --quiet || git commit -m "feat: mot de passe oublié avec email OVH + page reset"
git push
