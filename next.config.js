/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
}

const menu = require("./libraries/menu")

module.exports = (phare, { defaultConfig }) => {
    return {
        env: {
            menu: menu.get("pages/demos/")
        }
    }
}
