import fs from 'fs'
import { XMLParser, XMLBuilder, XMLValidator } from 'fast-xml-parser'

function generateSpellId(name) {
    return name.replace(/[^A-Za-z0-9]/g, '').toLowerCase()
}

function generateManeuverTuple(rawManeuver) {
    return [
        [generateSpellId(rawManeuver.name)],
        {
            "cast": {
                "#text": 0,
                "@@type": "number"
            },
            "castingtime": {
                "#text": rawManeuver.initiationAction || "",
                "@@type": "string"
            },
            "components": {
                "#text": rawManeuver['prerequisiteS)'] || "",
                "@@type": "string"
            },
            "cost": {
                "#text": 0,
                "@@type": "number"
            },
            "description": {
                "p": [
                    rawManeuver.description || ""
                ],
                "@@type": "formattedtext"
            },
            "duration": {
                "#text": rawManeuver.duration || "",
                "@@type": "string"
            },
            "effect": {
                "#text": rawManeuver.target || "",
                "@@type": "string"
            },
            "level": {
                "#text": rawManeuver.level || "",
                "@@type": "string"
            },
            "linkedspells": "",
            "name": {
                "#text": rawManeuver.name || "",
                "@@type": "string"
            },
            "prepared": {
                "#text": 0,
                "@@type": "number"
            },
            "range": {
                "#text": rawManeuver.range || "",
                "@@type": "string"
            },
            "save": {
                "#text": rawManeuver.savingThrow || "none",
                "@@type": "string"
            },
            "school": {
                "#text": rawManeuver.discipline || "",
                "@@type": "string"
            },
            "shortdescription": {
                "#text": rawManeuver.shortDesc || "",
                "@@type": "string"
            },
            "sr": {
                "#text": "no",
                "@@type": "string"
            }
        }
    ]
}

function main() {
    const maneuvers = JSON.parse(fs.readFileSync("output.json"))
    const convertedManeuvers = [Object.fromEntries(maneuvers.map(maneuver => generateManeuverTuple(maneuver)))]

    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@@",
        format: true,
        arrayNodeName: "spelldesc"
    }
    const builder = new XMLBuilder(options)
    const output = builder.build(convertedManeuvers)
    fs.writeFileSync("output.xml", output)
}

main()