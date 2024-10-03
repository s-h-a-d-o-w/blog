# Blog

Since I based this on a template, please don't change the code quality as if it was mine. 😅 
This also made me realize that [serenade](https://github.com/serenadeai/serenade) doesn't support astro, so the formatting can be strange and ugly in places too. But it works well, which is all I'm really looking for it in a simple blog. 😄

## How to run on WSL

```
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4321 connectaddress=<WSL IP> connectport=4321
netsh advfirewall firewall add rule name="Astro Dev Server" dir=in action=allow protocol=TCP localport=4321
```
