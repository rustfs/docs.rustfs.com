---
title: "RustFS Nginx Reverse Proxy Konfiguration"
description: "Konfiguration zur Implementierung eines Nginx Reverse Proxy für RustFS"
---


# RustFS Integration mit Nginx

Durch die Integration von RustFS mit Nginx können folgende Funktionen realisiert werden:

1. Umfassende Log-Sammlung;
2. Lastenausgleichskonfiguration;
3. Benutzerdefinierte URL-Weiterleitung und -Auflösung;
4. Benutzerdefinierte URL-Blockierung.


## I. RustFS Nginx Voraussetzungen

Damit die Integration reibungslos verläuft, müssen Sie vorher vorbereitet haben:

1. RustFS Server ist normal installiert und korrekt gestartet;
2. RustFS-Port bestimmen;
3. Nginx korrekt identifiziert;
4. IP-Adressen des RustFS-Einzelservers oder -Clusters bestätigen.



## II. Konfigurationsdatei


~~~


upstream rustfs {
   least_conn;
   server 127.0.0.1:9000;
}
server {
   listen       8000;
   listen  [::]:8000;
   server_name  _;

   # Allow special characters in headers
   ignore_invalid_headers off;
   # Allow any size file to be uploaded.
   # Set to a value such as 1000m; to restrict file size to a specific value
   client_max_body_size 0;
   # Disable buffering
   proxy_buffering off;
   proxy_request_buffering off;

   location / {
      proxy_set_header Host $http_host;
      proxy_set_header X-Real-IP $remote_addr;
      proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
      proxy_set_header X-Forwarded-Proto $scheme;

      proxy_connect_timeout 300;
      # Default is HTTP/1, keepalive is only enabled in HTTP/1.1
      proxy_http_version 1.1;
      proxy_set_header Connection "";
      chunked_transfer_encoding off;

      proxy_set_header Upgrade $http_upgrade;
      proxy_set_header Connection "upgrade";




      proxy_pass http://rustfs; # This uses the upstream directive definition to load balance
   }
}

~~~


## III. Multi-Server Lastenausgleich


Wenn Sie mehrere RustFS-Server in einer verteilten Umgebung hinzufügen möchten, passen Sie bitte vorher die DNS-Auflösung oder die lokalen Hosts-Adressen an und modifizieren und fügen Sie Server hinzu.

~~~
upstream rustfs {
   least_conn;
   server 10.0.0.1:9000;
   server 10.0.0.2:9000;
   server 10.0.0.3:9000;
   server 10.0.0.4:9000;
}
~~~