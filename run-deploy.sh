#!/bin/bash

echo "=== [1/4] Menjalankan Git Commit (jika ada perubahan yang belum di-commit) ==="
# Otomatis add dan commit perubahan lokal Anda (opsional, atau bisa manual dulu)
git add .
read -p "Masukkan pesan commit Anda: " commit_msg
git commit -m "$commit_msg"

echo "=== [2/4] Melakukan Build Project React ==="
npm install
npm run build

# Tentukan folder hasil build (dist atau build)
BUILD_DIR="dist"
if [ ! -d "$BUILD_DIR" ]; then
    BUILD_DIR="build"
fi

if [ ! -d "$BUILD_DIR" ]; then
    echo "❌ Error: Folder hasil build tidak ditemukan! Proses dibatalkan."
    exit 1
fi

echo "=== [3/4] Menyalin hasil build ke direktori deployment ==="
# Sesuaikan target foldernya dengan direktori deployment Anda di /var/www/
TARGET_DIR="/var/www/kkpusid" # Ganti dengan /var/www/admin.kkpus.id untuk repo admin

sudo rm -rf ${TARGET_DIR}/*
sudo cp -r ${BUILD_DIR}/* ${TARGET_DIR}/

echo "=== [4/4] Push cadangan ke GitHub ==="
git push origin main # Sesuaikan nama branch-nya (main/master/dev)

echo "✨ Sukses! Build, Deployment ke /var/www/, dan Push ke GitHub Berhasil!"
