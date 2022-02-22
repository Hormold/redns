## Simple DNS server on NodeJS

Just a simple implementation of the DNS server with data storage in Redis on NodeJS core modules with only one dependency (synchronized socket)
## Inspired by https://github.com/bobuk/udns

This is ready to be used in real world, but if you want to learn how to make a simple DNS server—it can be example. In this example, the DNS server checks the hostname in Redis and, if it exists, returns the IP address. If not—it forwards request to real DNS server like 8.8.8.8.
Redis protocol as DNS protocol do not require a dependency lib. 

You can read more in original repository (on Python)— https://github.com/bobuk/udns

And watch copy of live stream by author of original idea — https://drive.google.com/file/d/1P5NFxfbFq4yT94rmnM527ak5gCKC5JIe/view (in Russian)