import fs from 'fs'
import * as parseManeuvers from './parseManeuvers.js'
import * as xmlConversion from './xmlConversion.js'

async function main() {
    const results = await parseManeuvers.scrapeDiscipline("https://libraryofmetzofitz.fandom.com/wiki/Broken_Blade")
    const output = xmlConversion.convertManuversToXml(results)
    fs.writeFileSync("output.xml", output)
}

main()