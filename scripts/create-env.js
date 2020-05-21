const fs = require('fs')
fs.writeFileSync('./.env', `URL=${"https://cryptic-island-45793.herokuapp.com"}\n`)
fs.writeFileSync('./.env', `REACT_APP_GOOGLE_GEOCODE_API_KEY=${process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY}\n`)
fs.writeFileSync('./.env', `REACT_APP_BETTER_DOC_API_KEY=${"376761dc9a0b6db741da0e97bfad107e"}\n`)