export default {
    async fetch(req) {
        return new Response('hello world', {
            status: 200
        })
    }
}