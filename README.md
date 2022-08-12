<div align="center">

# ExpressJS API Boilerplate

Backend boilerplate used by me, it contains the following functionality:

**MongoDB** / **JWT** / **Docker** / **Tests** / **TypeScript**

</div>

## Getting started

1. Use as template
2. Generate keys using `./generateKeys.sh`
3. Copy env example to `.env` and customize it
4. `npm install`
5. `npm run dev` for development with hot reload or `npm run build` for building

## Branches

- `main`: Main branch contains register/login and session verify logic (best as auth microservice)
- `main-auth-consumer`: Second branch contains only session verify logic (best as microservice which only needs user)
