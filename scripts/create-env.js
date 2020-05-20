const fs = require('fs')
fs.writeFileSync('./.env', `URL=${process.env.URL}\n` )
fs.writeFileSync('./.env', `REACT_APP_GOOGLE_GEOCODE_API_KEY=${process.env.REACT_APP_GOOGLE_GEOCODE_API_KEY}\n`)
fs.writeFileSync('./.env', `REACT_APP_BETTER_DOC_API_KEY=${process.env.REACT_APP_BETTER_DOC_API_KEY}\n`)