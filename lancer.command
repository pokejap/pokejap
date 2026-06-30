#!/bin/bash
cd "$(dirname "$0")"

echo "============================================"
echo "  PokeJap - Lancement du serveur local"
echo "============================================"
echo ""

# Liberer le port 3000 si occupe
lsof -ti:3000 | xargs kill -9 2>/dev/null
lsof -ti:3001 | xargs kill -9 2>/dev/null
sleep 1

# Installation si node_modules absent
if [ ! -d "node_modules" ]; then
  echo "Installation des dependances (une seule fois)..."
  npm install
  echo ""
fi

echo "Demarrage du site sur http://localhost:3000"
echo "Appuie sur Ctrl+C pour arreter."
echo ""

# Ouvrir le navigateur apres 3 secondes
(sleep 3 && open "http://localhost:3000") &

npm run dev
