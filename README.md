# Blog

I based this on a [template](https://github.com/Charca/astro-blog-template/tree/main).

This made me realize that [serenade](https://github.com/serenadeai/serenade) doesn't support astro, so the formatting can be strange and ugly in places. But it works well, which is all I'm really looking for it in a simple blog. 😄

## How to run on WSL

```
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4321 connectaddress=<WSL IP> connectport=4321
netsh advfirewall firewall add rule name="Astro Dev Server" dir=in action=allow protocol=TCP localport=4321
```

## Dev notes

Don't just kill the terminal in which dev is running. Otherwise, kroki will not shut down. Use Ctrl+C.