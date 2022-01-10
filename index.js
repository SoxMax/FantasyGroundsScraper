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

export async function scrapeDiscipline() {
    const baseUrl = 'https://libraryofmetzofitz.fandom.com'
    const html = await axios.get(`${baseUrl}/wiki/Black_Seraph`)
    const $ = await cheerio.load(html.data)
    const maneuvers = []


    var maneuverPromises = [];
    $('p').each(function (idx, elem) {
        var article = new Article({ content: $(this).html() });
        var promise = article.save();
        promises.push(promise); // db save async function or other async function
    });
    Promise.all(promises)
        .then(doSomethingOnSuccess)
        .catch(doSomethingOnError)
        .finally(mongoose.connection.close);

    $('table[class=wikitable]', '#content').each((i, table) => {
        $(table).find('tr').each(async (i, row) => {
            if (i > 0 && i < 2) {
                const firstCell = $(row).find('td').first()
                const name = $(firstCell).text().trim()
                const link = `${baseUrl}${$(firstCell).children().attr('href')}`
                const shortDesc = $(firstCell).next().next().text().trim()
                const result = Object.assign(await scrapeManuever(link), { name, link, shortDesc })
                maneuvers.push(result)
            }
        })
        return false
    })
    return maneuvers
}

export async function main() {
    const results = await scrapeDiscipline()
    console.log(results)
}

main()