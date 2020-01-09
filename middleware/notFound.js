export default function({ route, redirect }) {
    if (!route.matched.length) {
        return redirect(404, '/Error404')
    }
}
