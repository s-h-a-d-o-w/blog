# Blog

## How to run on WSL

```
netsh interface portproxy add v4tov4 listenaddress=0.0.0.0 listenport=4321 connectaddress=<WSL IP> connectport=4321
netsh advfirewall firewall add rule name="Astro Dev Server" dir=in action=allow protocol=TCP localport=4321
```
