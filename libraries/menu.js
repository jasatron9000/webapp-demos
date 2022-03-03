const fs = require('fs')
const path = require('path')

const defaultMetaData = {
    link: "/",
    application_name: "Unnamed Application", 
    description: "A web application",
    blurb_image: null
}

module.exports = {
    get: (rootPath) => {
        const newLineRegex = /(\r\n|\n|\r| {2})/gm
        const headRegex = /(?<=<Head>).+?(?=<\/Head>)/g
        const metaRegex = /(?<=<meta ).+?(?=\/>)/g
        const nameRegex = /(?<=name=").+?(?=")/g
        const contentRegex = /(?<=content=").+?(?=")/g

        let files = fs.readdirSync(rootPath)
        let fullPath = files.map((val) => {return path.join(rootPath, val)})
        let fileMetaData = []
        
        for (let i = 0; i < fullPath.length; i++) {
            const currPath = fullPath[i]
            let data = fs.readFileSync(fullPath[i], {encoding: 'utf8'})
                .replace(newLineRegex, "")
                .match(headRegex)
            
            let metaData = (data) ? data[0].match(metaRegex) : []

            let sortedSequence = {...defaultMetaData}
            if (metaData.length > 0) {
                metaData.map((val) => {
                    let name = val.match(nameRegex)[0]
                    const content = val.match(contentRegex)[0]

                    if (name.includes("-")){
                        name = name.replace("-", "_")
                    }
                    
                    sortedSequence = {...sortedSequence, [name]: content}
                    
                })
            }
            sortedSequence = {...sortedSequence, 
                link: currPath.replace("pages", "").replace(/(?=\.).+/g, "")
            }

            fileMetaData.push(sortedSequence)
        }
        
        return JSON.stringify(fileMetaData)
    } 
}