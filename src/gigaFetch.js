import config from "./config.json"
export default async (route, input) => {
    console.log(route)
    console.log(input)
    input.headers = new Headers({
        'Authorization': `Bearer ${config.API_TOKEN}`,
        'Content-Type': 'application/json'
    })
    const response = await fetch(`${config.API_ENDPOINT}${route}`, input)
    const data = await response.json()
    if (data.error) {
        alert(data.error)
        return
    }
    return data
}