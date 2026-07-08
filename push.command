#!/bin/bash
rm -f ~/Desktop/pokejap-final/.git/HEAD.lock
cd ~/Desktop/pokejap-final
git remote set-url origin https://github.com/Pokejap/pokejap.git
git add -A
git commit -m "feat: relay picker pro — API SOAP Mondial Relay + carte Leaflet + liste" 2>/dev/null || echo "(deja commit)"
git push
