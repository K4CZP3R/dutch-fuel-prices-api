<div align="center">

# dutch-fuel-prices-api

API wrapper for directlease.nl, returning all gas prices (euro95/98, diesel)

**MongoDB** / **jimp** / **tesseract.js**

</div>

## Getting started

1. npm i
2. Copy `.env.example` to `.env` and fill it in.
3. `npm run dev` for development with hot reload or `npm run build` for building

## How does it work?

directlease.nl has map with all gas stations, when you click on one, it fetches image with info about the selected gas station.
This wrapper uses OCR (tessreact.js) and Image manipulation (jimp) to parse text from image and save it in the database.

OCR takes some time, so caching is introduced, every (specified) interval, a new image will be analyzed, otherwise, wrapper will return cached data from database.

> Written in 2h so the code needs cleanup, but it works.

## Postman

`dutch-fuel-prices-api.postman_collection.json`

## Example output

### GET `/tankstation/by-city/Oss`

```json
{
	"success": true,
	"message": "Use getTankstationById to get the prices.",
	"data": [
		{
			"id": 6770,
			"cat": 1,
			"lat": 51.747045,
			"lng": 5.532179,
			"name": "de Kock",
			"city": "Oss",
			"country": "NL"
		},
		{
			"id": 4474,
			"cat": 1,
			"lat": 51.76444,
			"lng": 5.545967,
			"brand": "TinQ",
			"city": "Oss",
			"country": "NL"
		}
	]
}
```

### GET `/tankstation/by-id/4434`

```json
{
	"success": true,
	"message": "Returned up-to-date data.",
	"data": {
		"_id": "a4399e28-119a-4dd2-a5a2-7244c6b452c4",
		"city": "Oss",
		"country": "NL",
		"id": 4434,
		"lat": 51.754676,
		"lng": 5.525235,
		"name": "Dr Saal v Zwanenbergsingel",
		"prices": [
			{
				"fuelType": "euro95(e10)",
				"price": 2.03,
				"_id": "62f6f0ad3959ed1a827178c8"
			},
			{
				"fuelType": "diesel(b7)",
				"price": 1.9,
				"_id": "62f6f0ad3959ed1a827178c9"
			}
		],
		"createdAt": "2022-08-13T00:20:53.077Z",
		"updatedAt": "2022-08-13T00:30:37.332Z",
		"__v": 0
	}
}
```
