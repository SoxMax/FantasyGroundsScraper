function xmlExample() {
    const XMLdata = fs.readFileSync("example.xml")
    const options = {
        ignoreAttributes: false,
        attributeNamePrefix: "@@",
        format: true
    }
    const parser = new XMLParser(options);
    let result = parser.parse(XMLdata);
    console.log(JSON.stringify(result, null,4));
    fs.writeFileSync("example.json", JSON.stringify(result, null,4))

    const builder = new XMLBuilder(options);
    const output = builder.build(result);
}

function convertToXml(rawManeuver) {
    const stuff = {
        cast: {
            "@@type": "number"
        }
    }
}

// xmlExample()