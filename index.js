import axios from 'axios'
import cheerio from 'cheerio'

function camalize(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

export async function scrapeManuever(url) {
    const html = await axios.get(url)
    const $ = await cheerio.load(html.data)
    const maneuverDetails = {}

    $('div[class=mw-parser-output]', '#content').find('p').each((i, content) => {
        if ($(content).find('b').text().trim()) {
            $(content).text().trim().split(';').forEach(field => {
                const splitField = field.split(':')
                if (splitField.length > 1) {
                    maneuverDetails[camalize(splitField[0].trim())] = splitField[1].trim()
                }
            })
        } else {
            maneuverDetails['description'] = $(content).text().trim()
        }
    })
    return maneuverDetails
}

export async function scrapeDiscipline(url) {
    const html = await axios.get(url)
    const $ = await cheerio.load(html.data)
    const maneuvers = []

    $('table[class=wikitable]', '#content').each((i, table) => {
        $(table).find('tr').each((i, row) => {
            if (i > 0 && i < 2) {
                const firstCell = $(row).find('td').first()
                const name = $(firstCell).text().trim()
                const link = `${baseUrl}${$(firstCell).children().attr('href')}`
                const shortDesc = $(firstCell).next().next().text().trim()
                maneuvers.push({name, link, shortDesc})
            }
        })
    })
    return Promise.all(maneuvers.map(async maneuver => {
        const maneuverDetails = await scrapeManuever(maneuver.link)
        return Object.assign(maneuverDetails, maneuver)
    }))
}

export async function scrapeDisciplines() {
    const baseUrl = 'https://libraryofmetzofitz.fandom.com'
    return await scrapeDiscipline(`${baseUrl}/wiki/Black_Seraph`)
}

export function main() {
    const results = scrapeDiscipline()
    console.log(results)
}

main()