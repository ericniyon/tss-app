# Trust Seal System API

API for the Trust seal system project for E-Commerce websites

## Generating public & private keys

```
openssl ecparam -name prime256v1 -genkey -out private.ec.key
```

to get the private key

```
openssl ec -in ./private.ec.key
```

to get the public key

```
openssl ec -in ./private.ec.key -pubout
```

now cleanup the key file

```
rm ./private.ec.key
```

### 6. Swagger API documentation

> `http://localhost:5000/docs/swagger-ui`

## Contributors

-   [Brian GITEGO](briangitego@awesomity.rw)
-   [Christian Mucyo](mucyochristian@awesomity.rw)

## Copyright

Copyright (c) [Awesomity Lab](https://awesomity.rw) 2022
