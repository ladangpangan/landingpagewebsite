# Situs perusahaan ladangpangan.id

Situs statis PT Ladang Pangan Indonesia (beranda dan `/kontak`). Toko online ada di repo terpisah (`landingpage`, marketplace.ladangpangan.id).

- Isi situs: folder `site/` (HTML + CSS biasa, tanpa build).
- Server: nginx di Docker (`Dockerfile`, `nginx.conf`), HTTPS lewat Traefik (label di `docker-compose.yaml`).
- Alamat yang tidak dikenal diarahkan ke beranda (301); `www.` diarahkan ke `ladangpangan.id`.
- Favicon dan logo HARUS sama dengan toko online (`site/favicon.*`, `site/logo-ayam.svg`).

## Pasang di VPS (Hostinger)
`vps_docker_create(virtualMachineId=1956504, project_name="ladang-landingpage-web", content="https://github.com/ladangpangan/landingpagewebsite")`. Alat membaca cabang `master`, jadi `master` harus sama dengan `main`. Tanpa variabel environment. Jangan memakai nama proyek `ladang-landing`.

## DNS (Hostinger)
`@` A 148.230.102.34 dan `www` CNAME ladangpangan.id. Jangan ubah MX/SPF/DKIM/DMARC (email) dan subdomain lain.

## Mengubah isi
Edit file di `site/`, perbarui `lastmod` di `site/sitemap.xml`, lalu pasang ulang seperti di atas.
