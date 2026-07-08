#!/bin/bash
rm -f ~/Desktop/pokejap-final/.git/HEAD.lock
cd ~/Desktop/pokejap-final
git add -A
git commit -m "feat: relay picker pro — API SOAP Mondial Relay + carte Leaflet + liste"
git push
