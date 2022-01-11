import fs from 'fs'
import axios from 'axios'
import cheerio from 'cheerio'

const baseUrl = 'https://libraryofmetzofitz.fandom.com'

function camalize(str) {
    return str.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (m, chr) => chr.toUpperCase());
}

function cleanObject(obj) {
    Object.keys(obj).forEach(key => {
        obj[key] = obj[key].replace(/\u00A0/g, " ");
    })
    return obj
}

async function scrapeManuever(url, maneuver) {
    if(url == 'https://libraryofmetzofitz.fandom.comundefined') {
        console.log("scrapeManuever undefined url for ", maneuver.name)
        console.log(url, maneuver.link)
        return {}
    } else {
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
}

export async function scrapeDiscipline(url) {
    if(url == 'https://libraryofmetzofitz.fandom.comundefined') {
        console.log("scrapeDiscipline undefined url")
    }
    const html = await axios.get(url)
    const $ = await cheerio.load(html.data)
    const maneuvers = []

    $('table[class=wikitable]', '#content').each((i, table) => {
        // console.log($(table).find('tr').html())
        $(table).find('tr').each((i, row) => {
            if (i > 0) {
                const firstCell = $(row).find('td').first()
                const name = $(firstCell).text().trim()
                const link = `${baseUrl}${$(firstCell).children().attr('href')}`
                const shortDesc = $(firstCell).next().next().text().trim()
                maneuvers.push({name, link, shortDesc})
            }
        })
    })
    return Promise.all(maneuvers.map(async maneuver => {
        // console.log(maneuver.name, maneuver.link)
        const maneuverDetails = await scrapeManuever(maneuver.link, maneuver)
        return cleanObject(Object.assign(maneuverDetails, maneuver))
    }))
}

export async function scrapeDisciplines() {
    const html = await axios.get(`${baseUrl}/wiki/Martial_Disciplines`)
    const $ = await cheerio.load(html.data)
    const disciplineLinks = []

    $('table[class=wikitable]', '#content').find('tr').each((i, row) => {
        if(i > 0) {
            disciplineLinks.push(`${baseUrl}${$(row).find('td').first().children().attr('href')}`)
        }
    })
    return Promise.all(disciplineLinks.map(async link => {
        return await scrapeDiscipline(link)
    }))
}

async function main() {
    const results = await scrapeDiscipline("https://libraryofmetzofitz.fandom.com/wiki/Black_Seraph")
    fs.writeFileSync("output.json", JSON.stringify(results, null, 2))
    // console.log(results)
}

main()